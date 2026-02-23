
import { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type AppRole = 'buyer' | 'supplier' | 'admin' | 'guest';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole;
  profile: any | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    role: 'guest',
    profile: null,
    loading: true,
  });

  const fetchRoleAndProfile = async (userId: string) => {
    const [roleResult, profileResult] = await Promise.all([
      supabase.from('user_roles' as any).select('role').eq('user_id', userId).maybeSingle(),
      supabase.from('profiles' as any).select('*').eq('user_id', userId).maybeSingle(),
    ]);
    const role = ((roleResult.data as any)?.role as AppRole) || 'buyer';
    return { role, profile: profileResult.data as any };
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Defer role/profile fetch to avoid Supabase deadlock
        setTimeout(async () => {
          const { role, profile } = await fetchRoleAndProfile(session.user.id);
          setState({ user: session.user, session, role, profile, loading: false });
        }, 0);
      } else {
        setState({ user: null, session: null, role: 'guest', profile: null, loading: false });
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { role, profile } = await fetchRoleAndProfile(session.user.id);
        setState({ user: session.user, session, role, profile, loading: false });
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, role: AppRole, companyName: string, country: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    if (data.user) {
      // Insert role
      await supabase.from('user_roles').insert([{ user_id: data.user.id, role }] as any);
      // Update profile with company info
      await supabase.from('profiles').update({
        company_name: companyName,
        country,
        display_name: companyName,
      } as any).eq('user_id', data.user.id);
    }
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, session: null, role: 'guest', profile: null, loading: false });
  };

  const updateProfile = async (updates: Record<string, any>) => {
    if (!state.user) return;
    const { error } = await supabase.from('profiles' as any).update(updates).eq('user_id', state.user.id);
    if (error) throw error;
    setState(s => ({ ...s, profile: { ...s.profile, ...updates } }));
  };

  const refreshProfile = async () => {
    if (!state.user) return;
    const { role, profile } = await fetchRoleAndProfile(state.user.id);
    setState(s => ({ ...s, role, profile }));
  };

  return {
    ...state,
    isAuthenticated: !!state.user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };
}
