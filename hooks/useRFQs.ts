import { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';

export interface RFQ {
  id: string;
  buyer_id: string;
  crop: string;
  volume: string;
  incoterm: string;
  destination: string;
  timeline: string;
  instructions?: string;
  status: string;
  created_at: string;
}

export function useRFQs() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchRFQs = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('rfqs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) setRfqs(data as RFQ[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchRFQs();

    const channel = supabase
      .channel('rfqs-changes')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'rfqs' }, fetchRFQs)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const submitRFQ = async (rfq: Omit<RFQ, 'id' | 'created_at' | 'buyer_id' | 'status'>) => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('NOT_AUTHENTICATED');

      const { data, error } = await (supabase as any)
        .from('rfqs')
        .insert([{ ...rfq, buyer_id: user.id, status: 'OPEN' }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } finally {
      setSubmitting(false);
    }
  };

  return { rfqs, loading, submitting, refetch: fetchRFQs, submitRFQ };
}
