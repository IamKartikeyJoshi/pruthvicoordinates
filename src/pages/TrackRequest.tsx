import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, Calendar, Clock, Mail, Phone, User, 
  Video, CheckCircle, FileText, ArrowLeft, Loader2 
} from 'lucide-react';

interface Request {
  id: string;
  created_at: string;
  type: 'appointment' | 'contact';
  name: string;
  phone: string;
  email: string;
  message: string | null;
  project_type: string | null;
  location: string | null;
  tracking_code: string;
  meeting_link: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
}

const TrackRequest = () => {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!trackingCode) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .eq('tracking_code', trackingCode)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setRequest(data as Request);
        }
      } catch (err) {
        console.error('Error fetching request:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [trackingCode]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background page-bg">
        <Header />
        <main className="pt-24">
          <section className="py-24">
            <div className="container mx-auto px-6 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background page-bg">
        <Header />
        <main className="pt-24">
          <section className="py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-xl mx-auto text-center">
                <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-8">
                  <FileText className="w-10 h-10 text-foreground/40" />
                </div>
                <h1 className="font-serif text-3xl text-foreground mb-4">Request Not Found</h1>
                <p className="text-foreground/60 mb-8">
                  We couldn't find a request with tracking code: <br />
                  <span className="font-mono text-accent">{trackingCode}</span>
                </p>
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-bg">
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Track Your Request
              </h3>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
                Request <span className="italic text-accent">Status</span>
              </h1>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-foreground/60">Tracking Code:</span>
                <span className="text-accent font-semibold">{request?.tracking_code}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Request Details */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              {/* Status Badge */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Request Received</p>
                  <p className="text-foreground/60 text-sm font-mono">
                    {request?.type === 'appointment' ? 'Appointment Request' : 'Contact Inquiry'}
                  </p>
                </div>
              </div>

              {/* Details Card */}
              <div className="border border-foreground/10 bg-popover p-6 md:p-8 mb-8">
                <h2 className="font-serif text-xl text-foreground mb-6">Request Details</h2>
                
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                    <User className="w-4 h-4 text-foreground/40 mt-0.5" />
                    <div>
                      <span className="text-foreground/60 block text-xs">Name</span>
                      <span className="text-foreground">{request?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                    <Mail className="w-4 h-4 text-foreground/40 mt-0.5" />
                    <div>
                      <span className="text-foreground/60 block text-xs">Email</span>
                      <span className="text-foreground">{request?.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                    <Phone className="w-4 h-4 text-foreground/40 mt-0.5" />
                    <div>
                      <span className="text-foreground/60 block text-xs">Phone</span>
                      <span className="text-foreground">{request?.phone}</span>
                    </div>
                  </div>

                  {request?.project_type && (
                    <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                      <MapPin className="w-4 h-4 text-foreground/40 mt-0.5" />
                      <div>
                        <span className="text-foreground/60 block text-xs">Survey Type</span>
                        <span className="text-accent">{request.project_type}</span>
                      </div>
                    </div>
                  )}

                  {request?.location && (
                    <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                      <MapPin className="w-4 h-4 text-foreground/40 mt-0.5" />
                      <div>
                        <span className="text-foreground/60 block text-xs">Location</span>
                        <span className="text-foreground">{request.location}</span>
                      </div>
                    </div>
                  )}

                  {request?.type === 'appointment' && request?.appointment_date && (
                    <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                      <Calendar className="w-4 h-4 text-foreground/40 mt-0.5" />
                      <div>
                        <span className="text-foreground/60 block text-xs">Date</span>
                        <span className="text-foreground">{formatDate(request.appointment_date)}</span>
                      </div>
                    </div>
                  )}

                  {request?.type === 'appointment' && request?.appointment_time && (
                    <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                      <Clock className="w-4 h-4 text-foreground/40 mt-0.5" />
                      <div>
                        <span className="text-foreground/60 block text-xs">Time</span>
                        <span className="text-foreground">{request.appointment_time}</span>
                      </div>
                    </div>
                  )}

                  {request?.message && (
                    <div className="py-2">
                      <span className="text-foreground/60 block text-xs mb-2">Message</span>
                      <p className="text-foreground/80">{request.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meeting Link Section - Only for appointments */}
              {request?.type === 'appointment' && (
                <div className="border border-foreground/10 bg-secondary/30 p-6 md:p-8 mb-8">
                  <h2 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5 text-accent" />
                    Meeting Link
                  </h2>
                  
                  {request.meeting_link ? (
                    <div>
                      <p className="text-foreground/60 text-sm mb-4">
                        Your meeting link has been added by the admin.
                      </p>
                      <a
                        href={request.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-mono text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </a>
                    </div>
                  ) : (
                    <div className="bg-background/50 border border-foreground/10 p-4 rounded">
                      <p className="text-foreground/60 text-sm">
                        Your meeting link will be added by the admin shortly. Please check back later or wait for a WhatsApp confirmation message.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Back Button */}
              <div className="text-center">
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrackRequest;
