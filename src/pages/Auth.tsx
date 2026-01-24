import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, MapPin, Lock, Mail, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { user, signIn, isLoading, isConfigured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/admin');
    }
  }, [user, isLoading, navigate]);

  const validateForm = () => {
    try {
      if (isResetMode) {
        z.string().email('Please enter a valid email address').parse(email);
        setErrors({});
        return true;
      }
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: 'Reset Email Sent',
        description: 'Check your email for a password reset link.',
      });
      setIsResetMode(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isResetMode) {
      handleResetPassword();
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login')) {
          toast({
            title: 'Login Failed',
            description: 'Invalid email or password. Please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Welcome!',
          description: 'You have successfully logged in.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-mono text-foreground/60">Loading...</div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center px-6">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-background mb-2">Setup Required</h1>
          <p className="text-background/60 text-sm mb-6">
            The authentication system is being configured. Please try again in a moment.
          </p>
          <a href="/" className="text-accent hover:text-accent/80 text-sm font-mono uppercase tracking-widest">
            ← Back to website
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-6 page-bg">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-8 h-8 text-accent" />
            <span className="font-serif text-2xl text-background">Pruthvi</span>
          </div>
          <h1 className="font-serif text-3xl text-background mb-2">
            {isResetMode ? 'Reset Password' : 'Admin Login'}
          </h1>
          <p className="text-background/60 text-sm">
            {isResetMode 
              ? 'Enter your email to receive a reset link'
              : 'Sign in to manage appointments and contacts'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-background/40" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background/10 border-background/20 text-background pl-12 h-12 placeholder:text-background/30"
                placeholder="admin@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-accent text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {!isResetMode && (
            <div>
              <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-background/40" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/10 border-background/20 text-background pl-12 pr-12 h-12 placeholder:text-background/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-background/40 hover:text-background/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-accent text-xs mt-1">{errors.password}</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-mono uppercase tracking-widest"
          >
            {isSubmitting 
              ? (isResetMode ? 'Sending...' : 'Signing In...') 
              : (isResetMode ? 'Send Reset Link' : 'Sign In')}
          </Button>
        </form>

        {/* Toggle reset mode */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsResetMode(!isResetMode);
              setErrors({});
            }}
            className="text-background/60 hover:text-background text-sm font-mono"
          >
            {isResetMode ? '← Back to Login' : 'Forgot Password?'}
          </button>
        </div>

        {/* Quick access link */}
        <div className="text-center mt-4 pt-4 border-t border-background/10">
          <Link 
            to="/view-appointments" 
            className="text-accent hover:text-accent/80 text-xs font-mono uppercase tracking-widest"
          >
            View Appointments (Read-Only)
          </Link>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-background/40 hover:text-background/60 text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
