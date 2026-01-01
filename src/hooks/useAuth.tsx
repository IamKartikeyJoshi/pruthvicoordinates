import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Dynamically import supabase to catch initialization errors
        const { supabase } = await import('@/integrations/supabase/client');
        setSupabaseClient(supabase);
        setIsConfigured(true);

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              setTimeout(() => {
                checkAdminRole(supabase, session.user.id);
              }, 0);
            } else {
              setIsAdmin(false);
            }
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminRole(supabase, session.user.id);
        }
        setIsLoading(false);

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Supabase initialization failed:', err);
        setIsConfigured(false);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const checkAdminRole = async (supabase: any, userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      
      if (!error) {
        setIsAdmin(data === true);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseClient) {
      return { error: new Error('Authentication not available') };
    }
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (!supabaseClient) {
      return { error: new Error('Authentication not available') };
    }
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl }
    });
    return { error };
  };

  const signOut = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, isConfigured, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
