import { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { LISTINGS } from '../constants';

export interface Listing {
  id: string;
  supplier_id?: string;
  crop: string;
  origin: string;
  volume: string;
  price: number;
  grade: string;
  status?: string;
  description?: string;
  supplier?: string;
  created_at?: string;
}

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('listings')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setListings(data.map((d: any) => ({
          ...d,
          supplier: 'Verified Supplier',
        })));
      } else {
        setListings(LISTINGS.map(l => ({ ...l, supplier_id: undefined })));
      }
    } catch (err) {
      setListings(LISTINGS.map(l => ({ ...l, supplier_id: undefined })));
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();

    const channel = supabase
      .channel('listings-changes')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'listings' }, fetchListings)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const createListing = async (listing: Omit<Listing, 'id' | 'created_at'> & { supplier_id: string }) => {
    const { data, error } = await (supabase as any)
      .from('listings')
      .insert([listing])
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    const { data, error } = await (supabase as any)
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  return { listings, loading, error, refetch: fetchListings, createListing, updateListing };
}
