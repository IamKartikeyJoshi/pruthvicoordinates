import { useState, useEffect } from 'react';

export function useSupabase() {
  const [supabase, setSupabase] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSupabase = async () => {
      try {
        const module = await import('@/integrations/supabase/client');
        setSupabase(module.supabase);
      } catch (err) {
        console.error('Failed to load Supabase client:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSupabase();
  }, []);

  return { supabase, isLoading };
}
