import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, ArrowLeft, Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('is_admin_allowed')
          .eq('id', 1)
          .single();

        if (error) {
          console.error('Error checking admin settings:', error);
          setIsAllowed(false);
        } else if (data?.is_admin_allowed) {
          setIsAllowed(true);
          // Redirect to admin dashboard
          navigate('/admin');
          return;
        }
      } catch (err) {
        console.error('Failed to check admin access:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  // If admin is not allowed, show access denied
  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center px-6 page-bg">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-background mb-4">Admin Access Disabled</h1>
          <p className="text-background/60 text-sm mb-8">
            The admin panel is currently not available.
          </p>
          <Link 
            to="/" 
            className="text-accent hover:text-accent/80 text-sm font-mono uppercase tracking-widest inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to website
          </Link>
        </div>
      </div>
    );
  }

  return null;
};

export default Auth;
