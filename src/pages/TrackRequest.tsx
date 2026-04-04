import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { trackRequest, rescheduleRequest, checkAvailability } from '@/lib/adminSession';
import { formatTrackingCode } from '@/lib/trackingCodes';
import { 
  MapPin, Calendar, Clock, Mail, Phone, User, 
  Video, CheckCircle, FileText, ArrowLeft, Loader2, Copy,
  RefreshCw, ExternalLink, ArrowRight
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
  status: string;
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
];

const TrackRequest = () => {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [manualCode, setManualCode] = useState('');
  
  // Reschedule state
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [rescheduling, setRescheduling] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    if (trackingCode) fetchRequestData(trackingCode);
    else setLoading(false);
  }, [trackingCode]);

  useEffect(() => {
    if (rescheduleDate) {
      const fetchBooked = async () => {
        setLoadingAvailability(true);
        const result = await checkAvailability(rescheduleDate);
        if (result.bookedTimes) setBookedTimes(result.bookedTimes);
        setLoadingAvailability(false);
      };
      fetchBooked();
    }
  }, [rescheduleDate]);

  const fetchRequestData = async (code: string) => {
    setLoading(true);
    setNotFound(false);
    const result = await trackRequest(code);
    if (result.error || !result.request) {
      setNotFound(true);
    } else {
      setRequest(result.request as Request);
    }
    setLoading(false);
  };

  const handleManualTrack = () => {
    if (manualCode.trim()) {
      window.location.href = `/track/${manualCode.trim()}`;
    }
  };

  const handleReschedule = async () => {
    if (!trackingCode || !rescheduleDate || !rescheduleTime) return;
    setRescheduling(true);
    const result = await rescheduleRequest(trackingCode, rescheduleDate, rescheduleTime);
    if (result.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    } else {
      toast({ title: 'Rescheduled!', description: 'Your appointment has been updated.' });
      setShowReschedule(false);
      fetchRequestData(trackingCode);
    }
    setRescheduling(false);
  };

  const copyTrackingUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Copied!", description: "Page URL copied to clipboard." });
  };

  const canReschedule = () => {
    if (!request || request.type !== 'appointment' || request.status === 'cancelled') return false;
    if (!request.appointment_date) return false;
    const appointmentDate = new Date(request.appointment_date + 'T00:00:00');
    const dayPrior = new Date(appointmentDate);
    dayPrior.setDate(dayPrior.getDate() - 1);
    dayPrior.setHours(23, 59, 59, 999);
    return new Date() <= dayPrior;
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const currentAppointment = request?.appointment_date ? new Date(request.appointment_date + 'T00:00:00') : today;
    for (let i = 1; i <= 45; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // User can only postpone - date must be >= current appointment date
      if (date.getDay() !== 0 && date >= currentAppointment) {
        dates.push(date.toISOString().split('T')[0]);
        if (dates.length >= 21) break;
      }
    }
    return dates;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // No tracking code - show search form
  if (!trackingCode) {
    return (
      <div className="min-h-screen bg-background page-bg">
        <Header />
        <main className="pt-24">
          <section className="py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-xl mx-auto text-center">
                <h1 className="font-serif text-4xl text-foreground mb-4">Track Your <span className="italic text-accent">Request</span></h1>
                <p className="text-foreground/60 mb-8">Enter your tracking code to view your request status.</p>
                <div className="flex gap-2">
                  <Input value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="e.g. river-mountain-eagle" 
                    className="font-mono" onKeyDown={(e) => e.key === 'Enter' && handleManualTrack()} />
                  <Button onClick={handleManualTrack} className="bg-accent hover:bg-accent/90">Track</Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background page-bg">
        <Header />
        <main className="pt-24"><section className="py-24"><div className="container mx-auto px-6 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div></section></main>
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
                  We couldn't find a request with tracking code:<br />
                  <span className="font-mono text-accent">{trackingCode}</span>
                </p>
                <div className="flex gap-2 justify-center mb-4">
                  <Input value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Try another code" className="max-w-xs font-mono" />
                  <Button onClick={handleManualTrack} className="bg-accent hover:bg-accent/90">Track</Button>
                </div>
                <Link to="/"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Button></Link>
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
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Track Your Request</h3>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
                Request <span className="italic text-accent">Status</span>
              </h1>
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-foreground/60">Tracking Code:</span>
                <span className="text-accent font-semibold">{formatTrackingCode(request?.tracking_code || '')}</span>
                <Button variant="ghost" size="sm" onClick={copyTrackingUrl}><Copy className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              {/* Status Badge */}
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  request?.status === 'confirmed' ? 'bg-green-500/20' :
                  request?.status === 'cancelled' ? 'bg-red-500/20' :
                  'bg-accent/20'
                }`}>
                  <CheckCircle className={`w-5 h-5 ${
                    request?.status === 'confirmed' ? 'text-green-500' :
                    request?.status === 'cancelled' ? 'text-red-500' :
                    'text-accent'
                  }`} />
                </div>
                <div>
                  <p className="text-foreground font-medium capitalize">{request?.status || 'Pending'}</p>
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
                    <div><span className="text-foreground/60 block text-xs">Name</span><span className="text-foreground">{request?.name}</span></div>
                  </div>
                  <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                    <Mail className="w-4 h-4 text-foreground/40 mt-0.5" />
                    <div><span className="text-foreground/60 block text-xs">Email</span><span className="text-foreground">{request?.email}</span></div>
                  </div>
                  <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                    <Phone className="w-4 h-4 text-foreground/40 mt-0.5" />
                    <div><span className="text-foreground/60 block text-xs">Phone</span><span className="text-foreground">{request?.phone}</span></div>
                  </div>
                  {request?.project_type && (
                    <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                      <MapPin className="w-4 h-4 text-foreground/40 mt-0.5" />
                      <div><span className="text-foreground/60 block text-xs">Survey Type</span><span className="text-accent">{request.project_type}</span></div>
                    </div>
                  )}
                  {request?.type === 'appointment' && request?.appointment_date && (
                    <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                      <Calendar className="w-4 h-4 text-foreground/40 mt-0.5" />
                      <div><span className="text-foreground/60 block text-xs">Date</span><span className="text-foreground">{formatDate(request.appointment_date)}</span></div>
                    </div>
                  )}
                  {request?.type === 'appointment' && request?.appointment_time && (
                    <div className="flex items-start gap-4 py-2 border-b border-foreground/10">
                      <Clock className="w-4 h-4 text-foreground/40 mt-0.5" />
                      <div><span className="text-foreground/60 block text-xs">Time</span><span className="text-foreground">{request.appointment_time}</span></div>
                    </div>
                  )}
                  {request?.message && (
                    <div className="py-2"><span className="text-foreground/60 block text-xs mb-2">Message</span><p className="text-foreground/80">{request.message}</p></div>
                  )}
                </div>
              </div>

              {/* Meeting Link */}
              {request?.type === 'appointment' && (
                <div className="border border-foreground/10 bg-secondary/30 p-6 md:p-8 mb-8">
                  <h2 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2"><Video className="w-5 h-5 text-accent" /> Meeting Link</h2>
                  {request.meeting_link ? (
                    <div>
                      <p className="text-foreground/60 text-sm mb-4">Your meeting link has been added.</p>
                      <a href={request.meeting_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-mono text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors">
                        <Video className="w-4 h-4" /> Join Meeting
                      </a>
                    </div>
                  ) : (
                    <div className="bg-background/50 border border-foreground/10 p-4 rounded">
                      <p className="text-foreground/60 text-sm">Your meeting link will be added by the admin shortly.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reschedule Section */}
              {request?.type === 'appointment' && canReschedule() && (
                <div className="border border-foreground/10 bg-popover p-6 md:p-8 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl text-foreground flex items-center gap-2"><RefreshCw className="w-5 h-5 text-accent" /> Reschedule</h2>
                    {!showReschedule && (
                      <Button size="sm" variant="outline" onClick={() => setShowReschedule(true)}>Reschedule Appointment</Button>
                    )}
                  </div>
                  
                  {showReschedule && (
                    <div>
                      <p className="text-foreground/60 text-sm mb-4">You can postpone your appointment to a later date (until the day before your current appointment).</p>
                      
                      {/* Date Selection */}
                      <div className="mb-4">
                        <label className="font-mono text-xs text-foreground/60 mb-2 block uppercase">New Date</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {getAvailableDates().map((date) => (
                            <button key={date} onClick={() => { setRescheduleDate(date); setRescheduleTime(''); }}
                              className={`p-2 text-center border font-mono text-xs transition-all ${
                                rescheduleDate === date ? 'border-accent bg-accent/10 text-accent' : 'border-foreground/10 hover:border-accent/50 text-foreground/80'
                              }`}>{formatDateShort(date)}</button>
                          ))}
                        </div>
                      </div>

                      {/* Time Selection */}
                      {rescheduleDate && (
                        <div className="mb-4">
                          <label className="font-mono text-xs text-foreground/60 mb-2 block uppercase">
                            New Time {loadingAvailability && <span className="text-accent">(checking...)</span>}
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {timeSlots.map((time) => {
                              const isBooked = bookedTimes.includes(time);
                              // If same date as current, only allow later times
                              const isSameDate = rescheduleDate === request?.appointment_date;
                              const isEarlier = isSameDate && time <= (request?.appointment_time || '');
                              const disabled = isBooked || isEarlier;
                              return (
                                <button key={time} onClick={() => !disabled && setRescheduleTime(time)} disabled={disabled}
                                  className={`p-2 border font-mono text-xs transition-all ${
                                    disabled ? 'border-foreground/5 text-foreground/30 cursor-not-allowed' :
                                    rescheduleTime === time ? 'border-accent bg-accent/10 text-accent' :
                                    'border-foreground/10 hover:border-accent/50 text-foreground/80'
                                  }`}>
                                  {time}
                                  {isBooked && <span className="block text-[9px] text-foreground/30">Booked</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={handleReschedule} disabled={!rescheduleDate || !rescheduleTime || rescheduling}
                          className="bg-accent hover:bg-accent/90">
                          {rescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowReschedule(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Back */}
              <div className="text-center">
                <Link to="/"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Button></Link>
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
