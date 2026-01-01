import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { 
  Calendar, Clock, MapPin, User, Mail, Phone, 
  ArrowLeft, ArrowRight, CheckCircle, FileText, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const projectTypes = [
  { id: "topographical", label: "Topographical Survey", icon: "📍" },
  { id: "boundary", label: "Boundary Demarcation", icon: "🔲" },
  { id: "dgps", label: "DGPS Control Survey", icon: "📡" },
  { id: "asbuilt", label: "As-Built Survey", icon: "🏗️" },
  { id: "contour", label: "Contour Mapping", icon: "🗺️" },
  { id: "lidar", label: "LiDAR Survey", icon: "🛰️" },
  { id: "drone", label: "Drone Aerial Survey", icon: "✈️" },
  { id: "bathymetry", label: "Bathymetry Survey", icon: "🌊" },
  { id: "route", label: "Route Survey", icon: "🛤️" },
  { id: "other", label: "Other / Consultation", icon: "💬" },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
];

interface FormData {
  projectType: string;
  projectLabel: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  location: string;
  appointmentDate: string;
  appointmentTime: string;
  meetingLink: string;
  notes: string;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const { supabase, isMock } = useSupabase();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    projectType: "",
    projectLabel: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    location: "",
    appointmentDate: "",
    appointmentTime: "",
    meetingLink: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate next 30 available days (skip Sundays)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 45; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Skip Sundays
        dates.push(date.toISOString().split('T')[0]);
        if (dates.length >= 21) break;
      }
    }
    return dates;
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  const formatDateFull = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleProjectSelect = (id: string, label: string) => {
    setFormData({ ...formData, projectType: id, projectLabel: label });
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Name is required";
    }
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Invalid email format";
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = "Phone is required";
    } else if (!/^[\d\s+()-]{10,}$/.test(formData.clientPhone)) {
      newErrors.clientPhone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Please select a date";
    }
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Please select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (supabase) {
        await supabase.from('appointments').insert({
          project_type: formData.projectType,
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          client_phone: formData.clientPhone,
          location: formData.location || null,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          meeting_link: formData.meetingLink || null,
          notes: formData.notes || null,
          status: 'pending',
        });

        // Try to send email notification
        if (!isMock) {
          try {
            await supabase.functions.invoke('send-appointment-email', {
              body: {
                clientName: formData.clientName,
                clientEmail: formData.clientEmail,
                clientPhone: formData.clientPhone,
                projectType: formData.projectLabel,
                location: formData.location,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                meetingLink: formData.meetingLink,
                notes: formData.notes,
              },
            });
          } catch (e) {
            console.error("Email notification failed:", e);
          }
        }
      }

      setSubmitted(true);
      toast({
        title: "Appointment Requested!",
        description: "We'll confirm your appointment within 24 hours.",
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Screen
  if (submitted) {
    const whatsAppLink = generateWhatsAppLink({
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      projectType: formData.projectLabel,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      location: formData.location || undefined,
      meetingLink: formData.meetingLink || undefined,
    });

    return (
      <div className="min-h-screen bg-background page-bg">
        <Header />
        <main className="pt-24">
          <section className="py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-10 h-10 text-accent" />
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
                  Appointment <span className="italic text-accent">Requested</span>
                </h2>
                <p className="text-foreground/70 text-lg mb-4">
                  Thank you, <span className="text-accent font-semibold">{formData.clientName}</span>!
                </p>
                <p className="text-foreground/60 mb-8">
                  Your appointment for <span className="font-semibold">{formatDateFull(formData.appointmentDate)}</span> at <span className="font-semibold">{formData.appointmentTime}</span> has been received.
                  <br />Our team will confirm within 24 hours.
                </p>
                
                <div className="bg-secondary/30 border border-foreground/10 p-6 mb-8 text-left">
                  <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                    <div>
                      <span className="text-foreground/50 text-xs">Survey Type</span>
                      <p className="text-accent">{formData.projectLabel}</p>
                    </div>
                    <div>
                      <span className="text-foreground/50 text-xs">Date & Time</span>
                      <p className="text-foreground">{formatDateDisplay(formData.appointmentDate)}, {formData.appointmentTime}</p>
                    </div>
                    {formData.location && (
                      <div className="col-span-2">
                        <span className="text-foreground/50 text-xs">Location</span>
                        <p className="text-foreground">{formData.location}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Send on WhatsApp
                  </a>
                  <Button onClick={() => navigate('/')} variant="outline">
                    Return Home
                  </Button>
                </div>
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
                Book an Appointment
              </h3>
              <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4">
                Schedule Your <span className="italic text-accent">Survey</span>
              </h1>
              <p className="text-foreground/60 text-lg">
                Choose your preferred date and time. We'll confirm within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-6 bg-background border-b border-foreground/10">
          <div className="container mx-auto px-6">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 md:gap-4 font-mono text-xs">
                {[
                  { num: 1, label: "TYPE" },
                  { num: 2, label: "DETAILS" },
                  { num: 3, label: "SCHEDULE" },
                  { num: 4, label: "CONFIRM" },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2 md:gap-4">
                    <div className={`flex items-center gap-1 md:gap-2 ${step >= s.num ? "text-accent" : "text-foreground/40"}`}>
                      <span className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-xs ${
                        step >= s.num ? "border-accent bg-accent/20" : "border-foreground/20"
                      }`}>
                        {step > s.num ? "✓" : s.num}
                      </span>
                      <span className="hidden sm:inline text-xs">{s.label}</span>
                    </div>
                    {i < 3 && <div className={`w-6 md:w-8 h-px ${step > s.num ? "bg-accent" : "bg-foreground/20"}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              
              {/* Step 1: Project Type */}
              {step === 1 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-center font-serif text-2xl text-foreground mb-8">
                    What type of survey do you need?
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleProjectSelect(type.id, type.label)}
                        className="p-4 md:p-6 border border-foreground/10 hover:border-accent hover:bg-accent/5 transition-all duration-300 text-center group"
                      >
                        <span className="text-2xl md:text-3xl mb-2 md:mb-3 block">{type.icon}</span>
                        <span className="text-xs md:text-sm font-medium text-foreground/80 group-hover:text-accent transition-colors leading-tight">
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="text-center mt-8">
                    <Button variant="ghost" onClick={() => navigate('/contact')}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Contact
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Client Details */}
              {step === 2 && (
                <div className="animate-fade-in-up">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-foreground/60 hover:text-accent mb-8 font-mono text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change survey type
                  </button>

                  <div className="bg-accent/10 border border-accent/30 px-4 py-2 mb-8 inline-block">
                    <span className="font-mono text-xs text-foreground/60">SELECTED: </span>
                    <span className="font-mono text-sm text-accent">{formData.projectLabel}</span>
                  </div>

                  <h2 className="font-serif text-2xl text-foreground mb-8">Your Details</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-2 uppercase tracking-widest">
                        <User className="w-4 h-4" /> Full Name *
                      </label>
                      <Input
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className={`h-12 ${errors.clientName ? 'border-red-500' : ''}`}
                      />
                      {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-2 uppercase tracking-widest">
                        <Mail className="w-4 h-4" /> Email *
                      </label>
                      <Input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className={`h-12 ${errors.clientEmail ? 'border-red-500' : ''}`}
                      />
                      {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-2 uppercase tracking-widest">
                        <Phone className="w-4 h-4" /> Phone *
                      </label>
                      <Input
                        type="tel"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className={`h-12 ${errors.clientPhone ? 'border-red-500' : ''}`}
                      />
                      {errors.clientPhone && <p className="text-red-500 text-xs mt-1">{errors.clientPhone}</p>}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-2 uppercase tracking-widest">
                        <MapPin className="w-4 h-4" /> Site Location
                      </label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Area or Full Address"
                        className="h-12"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-2 uppercase tracking-widest">
                        <FileText className="w-4 h-4" /> Meeting Link (Optional)
                      </label>
                      <Input
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleInputChange}
                        placeholder="Zoom/Google Meet link if online meeting"
                        className="h-12"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-2 uppercase tracking-widest">
                        <FileText className="w-4 h-4" /> Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-input bg-background rounded-md resize-none text-foreground"
                        placeholder="Any specific requirements or questions..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button onClick={goNext} className="bg-accent hover:bg-accent/90">
                      Choose Date & Time
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {step === 3 && (
                <div className="animate-fade-in-up">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-foreground/60 hover:text-accent mb-8 font-mono text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to details
                  </button>

                  <h2 className="font-serif text-2xl text-foreground mb-8">Select Date & Time</h2>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Date Selection */}
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-4 uppercase tracking-widest">
                        <Calendar className="w-4 h-4" /> Select Date *
                      </label>
                      {errors.appointmentDate && <p className="text-red-500 text-xs mb-2">{errors.appointmentDate}</p>}
                      <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                        {getAvailableDates().map((date) => (
                          <button
                            key={date}
                            onClick={() => {
                              setFormData({ ...formData, appointmentDate: date });
                              setErrors({ ...errors, appointmentDate: '' });
                            }}
                            className={`p-3 border text-center transition-all text-sm ${
                              formData.appointmentDate === date
                                ? "border-accent bg-accent/20 text-accent"
                                : "border-foreground/10 hover:border-accent/50 text-foreground/80"
                            }`}
                          >
                            {formatDateDisplay(date)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-4 uppercase tracking-widest">
                        <Clock className="w-4 h-4" /> Select Time *
                      </label>
                      {errors.appointmentTime && <p className="text-red-500 text-xs mb-2">{errors.appointmentTime}</p>}
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => {
                              setFormData({ ...formData, appointmentTime: time });
                              setErrors({ ...errors, appointmentTime: '' });
                            }}
                            className={`p-3 border text-center transition-all text-sm ${
                              formData.appointmentTime === time
                                ? "border-accent bg-accent/20 text-accent"
                                : "border-foreground/10 hover:border-accent/50 text-foreground/80"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button 
                      onClick={goNext} 
                      className="bg-accent hover:bg-accent/90"
                      disabled={!formData.appointmentDate || !formData.appointmentTime}
                    >
                      Review & Confirm
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="animate-fade-in-up">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-foreground/60 hover:text-accent mb-8 font-mono text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change date/time
                  </button>

                  <h2 className="font-serif text-2xl text-foreground mb-8">Confirm Your Appointment</h2>

                  <div className="border border-foreground/10 bg-popover p-6 md:p-8">
                    <div className="space-y-4 font-mono text-sm">
                      <div className="flex justify-between py-2 border-b border-foreground/10">
                        <span className="text-foreground/60">Survey Type</span>
                        <span className="text-accent">{formData.projectLabel}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-foreground/10">
                        <span className="text-foreground/60">Name</span>
                        <span className="text-foreground">{formData.clientName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-foreground/10">
                        <span className="text-foreground/60">Email</span>
                        <span className="text-foreground">{formData.clientEmail}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-foreground/10">
                        <span className="text-foreground/60">Phone</span>
                        <span className="text-foreground">{formData.clientPhone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-foreground/10">
                        <span className="text-foreground/60">Date</span>
                        <span className="text-foreground">{formatDateFull(formData.appointmentDate)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-foreground/10">
                        <span className="text-foreground/60">Time</span>
                        <span className="text-foreground">{formData.appointmentTime}</span>
                      </div>
                      {formData.location && (
                        <div className="flex justify-between py-2 border-b border-foreground/10">
                          <span className="text-foreground/60">Location</span>
                          <span className="text-foreground">{formData.location}</span>
                        </div>
                      )}
                      {formData.meetingLink && (
                        <div className="flex justify-between py-2 border-b border-foreground/10">
                          <span className="text-foreground/60">Meeting Link</span>
                          <span className="text-foreground truncate max-w-[200px]">{formData.meetingLink}</span>
                        </div>
                      )}
                      {formData.notes && (
                        <div className="py-2">
                          <span className="text-foreground/60 block mb-2">Notes</span>
                          <p className="text-foreground/80">{formData.notes}</p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="mt-8 w-full bg-accent hover:bg-accent/90 py-6"
                    >
                      {isSubmitting ? "Submitting..." : "Confirm Appointment"}
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookAppointment;
