import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginWithPassphrase, getStoredSession, verifySession } from '@/lib/adminSession';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const Auth = () => {
  const [passphrase, setPassphrase] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const checkExisting = async () => {
      const session = getStoredSession();
      if (session) {
        const valid = await verifySession();
        if (valid) {
          navigate('/admin');
          return;
        }
      }
      setIsLoading(false);
    };
    checkExisting();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passphrase.trim()) {
      toast({ title: 'Error', description: 'Please enter the passphrase', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    const result = await loginWithPassphrase(passphrase);

    if (result.success) {
      toast({ title: 'Welcome', description: 'Access granted' });
      navigate('/admin');
    } else {
      toast({ title: 'Access Denied', description: result.error, variant: 'destructive' });
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-6 page-bg">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-background mb-2">Admin Access</h1>
          <p className="text-background/60 text-sm">
            Enter the admin passphrase to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <Input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter passphrase"
              className="pl-10 bg-background border-foreground/20 text-foreground"
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Access Admin Panel'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-accent hover:text-accent/80 text-sm font-mono uppercase tracking-widest inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
