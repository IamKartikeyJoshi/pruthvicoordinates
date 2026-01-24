import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MapPin, Calendar, Clock, Phone, Mail, 
  ArrowLeft, RefreshCw
} from 'lucide-react';

interface Appointment {
  id: string;
  created_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  project_type: string;
  location: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
}

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (fetchError) throw fetchError;
      setAppointments(data || []);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-700 dark:text-red-400';
      case 'completed': return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-background py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-accent" />
            <span className="font-serif text-xl">Pruthvi Appointments</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-background hover:text-accent">
                Admin Login
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-background hover:text-accent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground mb-2">Appointments</h1>
            <p className="text-foreground/60 text-sm">View-only access to all scheduled appointments</p>
          </div>
          <Button 
            onClick={fetchAppointments} 
            variant="outline" 
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse font-mono text-foreground/60">Loading appointments...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchAppointments} variant="outline">Try Again</Button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((apt) => (
              <div 
                key={apt.id} 
                className="border border-foreground/10 bg-card p-6 rounded-lg hover:border-foreground/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-serif text-xl text-foreground">{apt.client_name}</h3>
                      <span className={`text-xs font-mono px-2 py-1 rounded uppercase ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{formatDate(apt.appointment_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>{formatTime(apt.appointment_time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Mail className="w-4 h-4 text-accent" />
                        <span>{apt.client_email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Phone className="w-4 h-4 text-accent" />
                        <span>{apt.client_phone}</span>
                      </div>
                    </div>
                    
                    {apt.location && (
                      <div className="flex items-center gap-2 text-foreground/70 mt-2 text-sm">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{apt.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:text-right">
                    <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded text-sm font-mono">
                      {apt.project_type}
                    </div>
                    {apt.notes && (
                      <p className="text-foreground/50 text-xs mt-2 max-w-xs">
                        {apt.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewAppointments;
