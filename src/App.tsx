import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState, createContext, useContext, ReactNode } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load pages that use Supabase
const Mission = lazy(() => import("./pages/Mission"));
const Expertise = lazy(() => import("./pages/Expertise"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Contact = lazy(() => import("./pages/Contact"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

// Simple auth context that doesn't depend on Supabase import at module level
interface SimpleAuthContextType {
  user: any;
  session: any;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => useContext(SimpleAuthContext);

function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const init = async () => {
      try {
        const module = await import("@/integrations/supabase/client");
        if (!mounted) return;
        
        const client = module.supabase;
        setSupabase(client);

        const { data: { subscription: sub } } = client.auth.onAuthStateChange(
          async (event: any, sess: any) => {
            if (!mounted) return;
            setSession(sess);
            setUser(sess?.user ?? null);
            
            if (sess?.user) {
              try {
                const { data } = await client.rpc('has_role', {
                  _user_id: sess.user.id,
                  _role: 'admin'
                });
                if (mounted) setIsAdmin(data === true);
              } catch {
                if (mounted) setIsAdmin(false);
              }
            } else {
              if (mounted) setIsAdmin(false);
            }
          }
        );
        subscription = sub;

        const { data: { session: existingSession } } = await client.auth.getSession();
        if (!mounted) return;
        
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        
        if (existingSession?.user) {
          try {
            const { data } = await client.rpc('has_role', {
              _user_id: existingSession.user.id,
              _role: 'admin'
            });
            if (mounted) setIsAdmin(data === true);
          } catch {
            if (mounted) setIsAdmin(false);
          }
        }
        
        if (mounted) setIsLoading(false);
      } catch (err) {
        console.error("Auth init failed:", err);
        if (mounted) setIsLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Not configured") };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Not configured") };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` }
    });
    return { error };
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <SimpleAuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse font-mono text-foreground/60">Loading...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SimpleAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/expertise" element={<Expertise />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SimpleAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
