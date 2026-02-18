import { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';

export interface Order {
  id: string;
  buyer_id: string;
  supplier_id: string;
  listing_id?: string;
  crop: string;
  volume: string;
  price: number;
  destination: string;
  incoterm: string;
  status: string;
  vessel?: string;
  container?: string;
  eta?: string;
  confidence: number;
  risk_level: string;
  risk_reason?: string;
  telemetry?: { temp?: string; humidity?: string; lat?: string; lng?: string };
  created_at: string;
}

export const PIPELINE = ['CONFIRMED', 'PAID', 'INSPECTED', 'SHIPPED', 'DELIVERED'];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await (supabase as any)
      .from('orders')
      .select('*')
      .or(`buyer_id.eq.${user.id},supplier_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data.map((o: any) => ({
        ...o,
        telemetry: o.telemetry as Order['telemetry'],
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'buyer_id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('NOT_AUTHENTICATED');

    const { data, error } = await (supabase as any)
      .from('orders')
      .insert([{ ...order, buyer_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getStatusIndex = (status: string) => PIPELINE.indexOf(status);

  return { orders, loading, refetch: fetchOrders, createOrder, getStatusIndex, PIPELINE };
}
