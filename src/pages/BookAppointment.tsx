import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { 
  Calendar, Clock, MapPin, User, Mail, Phone, 
  ArrowLeft, ArrowRight, CheckCircle, FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appointmentFormSchema } from "@/lib/validations";
import { z } from "zod";

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
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    projectType: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    location: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const handleProjectSelect = (type: string) => {
    setFormData({ ...formData, projectType: type });
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleDateSelect = (date: string) => {
    setFormData({ ...formData, appointmentDate: date });
    if (errors.appointmentDate) {
      setErrors({ ...errors, appointmentDate: '' });
    }
  };

  const handleTimeSelect = (time: string) => {
    setFormData({ ...formData, appointmentTime: time });
    if (errors.appointmentTime) {
      setErrors({ ...errors, appointmentTime: '' });
    }
  };

  const validateStep2 = (): boolean => {
    try {
      appointmentFormSchema.pick({ clientName: true, clientEmail: true, clientPhone: true }).parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const validateStep3 = (): boolean => {
    try {
      appointmentFormSchema.pick({ appointmentDate: true, appointmentTime: true }).parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validate full form
    try {
      appointmentFormSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          project_type: formData.projectType,
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          client_phone: formData.clientPhone,
          location: formData.location || null,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          notes: formData.notes || null,
          status: 'pending',
        });

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-appointment-email', {
          body: {
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            clientPhone: formData.clientPhone,
            projectType: formData.projectType,
            location: formData.location,
            appointmentDate: formData.appointmentDate,
            appointmentTime: formData.appointmentTime,
            notes: formData.notes,
          },
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
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

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const goNext = () => {
    if (step === 2 && validateStep2()) setStep(3);
    if (step === 3 && validateStep3()) setStep(4);
  };

  // Generate next 30 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (submitted) {
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
                  Your appointment request for <span className="font-semibold">{formatDate(formData.appointmentDate)}</span> at <span className="font-semibold">{formData.appointmentTime}</span> has been received.
                  <br />Our team will confirm your appointment within 24 hours.
                </p>
                <div className="bg-secondary/30 p-6 rounded-lg mb-8">
                  <p className="font-mono text-sm text-foreground/60 mb-2">PROJECT TYPE</p>
                  <p className="font-serif text-xl text-accent">{formData.projectType}</p>
                </div>
                <Button onClick={() => navigate('/contact')} variant="outline">
                  Return to Contact
                </Button>
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
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Book an Appointment
              </h3>
              <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6">
                Schedule Your <span className="italic text-accent">Survey</span>
              </h1>
              <p className="text-foreground/60 text-lg">
                Choose your preferred date and time. We'll confirm your appointment within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-8 bg-background border-b border-foreground/10">
          <div className="container mx-auto px-6">
            <div className="flex justify-center">
              <div className="flex items-center gap-4 font-mono text-xs">
                {[
                  { num: 1, label: "PROJECT" },
                  { num: 2, label: "DETAILS" },
                  { num: 3, label: "SCHEDULE" },
                  { num: 4, label: "CONFIRM" },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 ${step >= s.num ? "text-accent" : "text-foreground/40"}`}>
                      <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        step >= s.num ? "border-accent bg-accent/20" : "border-foreground/20"
                      }`}>
                        {s.num}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                    {i < 3 && <div className={`w-8 h-px ${step > s.num ? "bg-accent" : "bg-foreground/20"}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              
              {/* Step 1: Project Type */}
              {step === 1 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-center font-serif text-2xl text-foreground mb-8">
                    What type of survey do you need?
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleProjectSelect(type.id)}
                        className="p-6 border border-foreground/10 hover:border-accent hover:bg-accent/5 transition-all duration-300 text-center group"
                      >
                        <span className="text-3xl mb-3 block">{type.icon}</span>
                        <span className="text-sm font-medium text-foreground/80 group-hover:text-accent transition-colors">
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
                    Back
                  </button>

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
                        className="h-12"
                      />
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
                        className="h-12"
                      />
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
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-2 uppercase tracking-widest">
                        <MapPin className="w-4 h-4" /> Project Location
                      </label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, State or Address"
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
                        className="w-full px-4 py-3 border border-input bg-background rounded-md resize-none"
                        placeholder="Any specific requirements..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={goNext}
                      disabled={!validateStep2()}
                      className="bg-accent hover:bg-accent/90"
                    >
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
                    Back
                  </button>

                  <h2 className="font-serif text-2xl text-foreground mb-8">Select Date & Time</h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Date Selection */}
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-4 uppercase tracking-widest">
                        <Calendar className="w-4 h-4" /> Select Date *
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
                        {getAvailableDates().map((date) => (
                          <button
                            key={date}
                            onClick={() => handleDateSelect(date)}
                            className={`p-3 text-center border transition-all ${
                              formData.appointmentDate === date
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-foreground/10 hover:border-accent/50"
                            }`}
                          >
                            <span className="font-mono text-xs">{formatDate(date)}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-foreground/60 mb-4 uppercase tracking-widest">
                        <Clock className="w-4 h-4" /> Select Time *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`p-3 text-center border transition-all ${
                              formData.appointmentTime === time
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-foreground/10 hover:border-accent/50"
                            }`}
                          >
                            <span className="font-mono text-sm">{time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={goNext}
                      disabled={!validateStep3()}
                      className="bg-accent hover:bg-accent/90"
                    >
                      Review Appointment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Confirm */}
              {step === 4 && (
                <div className="animate-fade-in-up">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-foreground/60 hover:text-accent mb-8 font-mono text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <h2 className="font-serif text-2xl text-foreground mb-8">Confirm Your Appointment</h2>

                  <div className="bg-secondary/30 border border-foreground/10 p-8">
                    <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
                      <div>
                        <span className="text-foreground/60">Project Type</span>
                        <p className="text-accent font-semibold mt-1 capitalize">{formData.projectType}</p>
                      </div>
                      <div>
                        <span className="text-foreground/60">Date & Time</span>
                        <p className="text-foreground font-semibold mt-1">
                          {formatDate(formData.appointmentDate)} at {formData.appointmentTime}
                        </p>
                      </div>
                      <div>
                        <span className="text-foreground/60">Name</span>
                        <p className="text-foreground mt-1">{formData.clientName}</p>
                      </div>
                      <div>
                        <span className="text-foreground/60">Email</span>
                        <p className="text-foreground mt-1">{formData.clientEmail}</p>
                      </div>
                      <div>
                        <span className="text-foreground/60">Phone</span>
                        <p className="text-foreground mt-1">{formData.clientPhone}</p>
                      </div>
                      {formData.location && (
                        <div>
                          <span className="text-foreground/60">Location</span>
                          <p className="text-foreground mt-1">{formData.location}</p>
                        </div>
                      )}
                      {formData.notes && (
                        <div className="md:col-span-2">
                          <span className="text-foreground/60">Notes</span>
                          <p className="text-foreground/80 mt-1">{formData.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row gap-4 justify-end">
                      <Button variant="outline" onClick={() => navigate('/contact')}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-accent hover:bg-accent/90"
                      >
                        {isSubmitting ? "Submitting..." : "Confirm Appointment"}
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
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
