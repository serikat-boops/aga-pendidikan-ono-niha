import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('hpon_is_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setInitialized(true);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitialized(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setIsAdmin(false);
        try {
          localStorage.removeItem('hpon_is_admin');
        } catch {
          // ignore
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    if (session) {
      supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data) {
            setIsAdmin(true);
            try {
              localStorage.setItem('hpon_is_admin', 'true');
            } catch {
              // ignore
            }
          } else {
            setIsAdmin(false);
            try {
              localStorage.removeItem('hpon_is_admin');
            } catch {
              // ignore
            }
          }
          setLoading(false);
        })
        .catch(() => {
          setIsAdmin(false);
          try {
            localStorage.removeItem('hpon_is_admin');
          } catch {
            // ignore
          }
          setLoading(false);
        });
    } else {
      setIsAdmin(false);
      try {
        localStorage.removeItem('hpon_is_admin');
      } catch {
        // ignore
      }
      setLoading(false);
    }
  }, [session, initialized]);

  const signOut = async () => {
    try {
      localStorage.removeItem('hpon_is_admin');
    } catch {
      // ignore
    }
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ session, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
