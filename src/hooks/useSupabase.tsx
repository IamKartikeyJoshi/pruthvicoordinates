import { useState, useEffect } from 'react';

// Mock Supabase client for when real client fails to initialize
const createMockClient = () => ({
  from: (table: string) => ({
    insert: async (data: any) => {
      console.log(`[Mock DB] Inserting into ${table}:`, data);
      // Store in localStorage as fallback
      try {
        const existing = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
        existing.push({ ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() });
        localStorage.setItem(`mock_${table}`, JSON.stringify(existing));
      } catch (e) {
        console.error('LocalStorage save failed:', e);
      }
      return { data: null, error: null };
    },
    select: (columns?: string) => ({
      order: (column: string, options?: { ascending?: boolean }) => ({
        then: async (resolve: any) => {
          try {
            const data = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
            resolve({ data, error: null });
          } catch {
            resolve({ data: [], error: null });
          }
        }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        then: async (resolve: any) => {
          try {
            const existing = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
            const updated = existing.map((item: any) => 
              item[column] === value ? { ...item, ...data } : item
            );
            localStorage.setItem(`mock_${table}`, JSON.stringify(updated));
            resolve({ data: null, error: null });
          } catch {
            resolve({ data: null, error: null });
          }
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: async (resolve: any) => {
          try {
            const existing = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
            const filtered = existing.filter((item: any) => item[column] !== value);
            localStorage.setItem(`mock_${table}`, JSON.stringify(filtered));
            resolve({ data: null, error: null });
          } catch {
            resolve({ data: null, error: null });
          }
        }
      })
    }),
  }),
  functions: {
    invoke: async (name: string, options?: any) => {
      console.log(`[Mock Functions] Invoking ${name}:`, options?.body);
      return { data: null, error: null };
    }
  },
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Auth not available' } }),
    signUp: async () => ({ data: null, error: { message: 'Auth not available' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  _isMock: true,
});

export function useSupabase() {
  const [supabase, setSupabase] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    const loadSupabase = async () => {
      try {
        const module = await import('@/integrations/supabase/client');
        if (module.supabase) {
          setSupabase(module.supabase);
          setIsMock(false);
        } else {
          throw new Error('Supabase client is null');
        }
      } catch (err) {
        console.warn('Supabase unavailable, using mock client:', err);
        setSupabase(createMockClient());
        setIsMock(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSupabase();
  }, []);

  return { supabase, isLoading, isMock };
}
