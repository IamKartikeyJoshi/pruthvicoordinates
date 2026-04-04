import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, MapPin, Phone, Mail, CheckCircle, ArrowRight, ArrowLeft, X, Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { contactFormSchema } from "@/lib/validations";
import { generateTrackingCode, formatTrackingCode } from "@/lib/trackingCodes";
import { z } from "zod";

const ContactSection = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: "", name: "", email: "", phone: "", location: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const projectTypes = [
    { id: "topographical", label: "Topographical Survey", icon: "📍" },
    { id: "boundary", label: "Boundary Demarcation", icon: "🔲" },
    { id: "dgps", label: "DGPS Control Survey", icon: "📡" },
    { id: "asbuilt", label: "As-Built Survey", icon: "🏗️" },
    { id: "contour", label: "Contour Mapping", icon: "🗺️" },
    { id: "lidar", label: "LiDAR Survey", icon: "🛰️" },
    { id: "drone", label: "Drone Aerial Survey", icon: "✈️" },
    { id: "bathymetry", label: "Bathymetry Survey", icon: "🌊" },
    { id: "other", label: "Other / Consultation", icon: "💬" },
  ];

  const handleProjectSelect = (type: string) => {
    setFormData({ ...formData, projectType: type });
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep2 = (): boolean => {
    try {
      contactFormSchema.pick({ name: true, email: true, phone: true }).parse(formData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      contactFormSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        toast({ title: "Validation Error", description: "Please check the form for errors.", variant: "destructive" });
        return;
      }
    }

    setIsSubmitting(true);
    const newTrackingCode = generateTrackingCode();

    try {
      const { error } = await supabase.from('requests').insert({
        type: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        project_type: formData.projectType,
        location: formData.location || null,
        message: formData.message || null,
        tracking_code: newTrackingCode,
      });
      if (error) throw error;
      setTrackingCode(newTrackingCode);
      setSubmitted(true);
      toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({ title: "Submission Failed", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => { if (step > 1) setStep(step - 1); };

  const cancelForm = () => {
    setStep(1);
    setFormData({ projectType: "", name: "", email: "", phone: "", location: "", message: "" });
  };

  const copyTrackingUrl = () => {
    const url = `${window.location.origin}/track/${trackingCode}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Tracking URL copied to clipboard." });
  };

  if (submitted) {
    return (
      <section id="contact" className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Coordinates <span className="italic">Received</span>
            </h2>
            <p className="text-background/70 text-lg mb-6">
              Thank you, <span className="text-accent font-semibold">{formData.name}</span>!
              Our team will review your requirements and reach out within 24 hours.
            </p>
            
            {/* Tracking Code Display */}
            <div className="bg-background/10 border-2 border-accent/30 p-8 mb-6 inline-block">
              <p className="text-background/60 text-sm mb-2">Your Tracking Code</p>
              <p className="font-serif text-3xl text-accent font-bold mb-1">{formatTrackingCode(trackingCode)}</p>
              <p className="font-mono text-sm text-background/40 mb-4">{trackingCode}</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={copyTrackingUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-background/20 text-background/80 hover:text-accent hover:border-accent transition-colors font-mono text-xs uppercase">
                  <Copy className="w-3 h-3" /> Copy Tracking URL
                </button>
                <Link to={`/track/${trackingCode}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white hover:bg-accent/90 transition-colors font-mono text-xs uppercase">
                  <ExternalLink className="w-3 h-3" /> Track Request
                </Link>
              </div>
            </div>
            
            <p className="text-background/50 text-sm">
              Save this code to track your request status anytime
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5"><div className="grid-pattern h-full" /></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">Start Your Project</h3>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-background mb-6">
              Let's Define Your <br /><span className="italic text-background/80">Coordinates</span>
            </h2>
            <p className="text-background/60 max-w-lg mx-auto">
              Begin your precision surveying project in just a few steps.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 font-mono text-xs">
              {[1, 2, 3].map((num, i) => (
                <div key={num} className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${step >= num ? "text-accent" : "text-background/40"}`}>
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= num ? "border-accent bg-accent/20" : "border-background/20"}`}>{num}</span>
                    <span className="hidden sm:inline">{['PROJECT TYPE', 'YOUR DETAILS', 'CONFIRM'][i]}</span>
                  </div>
                  {i < 2 && <div className={`w-12 h-px ${step > num ? "bg-accent" : "bg-background/20"}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h3 className="text-center font-serif text-2xl mb-8 text-background/80">What type of survey do you need?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {projectTypes.map((type) => (
                  <button key={type.id} onClick={() => handleProjectSelect(type.id)}
                    className="p-6 border border-background/20 hover:border-accent hover:bg-accent/10 transition-all duration-300 text-left group">
                    <span className="text-3xl mb-4 block">{type.icon}</span>
                    <span className="font-sans text-sm font-semibold group-hover:text-accent transition-colors">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <button onClick={goBack} className="flex items-center gap-2 text-background/60 hover:text-accent mb-8 font-mono text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" />Back to project type
              </button>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className={`w-full bg-background/10 border-b-2 ${errors.name ? 'border-red-500' : 'border-background/20'} focus:border-accent py-3 px-4 text-lg outline-none transition-colors placeholder:text-background/40 text-background`}
                    placeholder="Enter your name" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className={`w-full bg-background/10 border-b-2 ${errors.email ? 'border-red-500' : 'border-background/20'} focus:border-accent py-3 px-4 text-lg outline-none transition-colors placeholder:text-background/40 text-background`}
                    placeholder="you@example.com" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    className={`w-full bg-background/10 border-b-2 ${errors.phone ? 'border-red-500' : 'border-background/20'} focus:border-accent py-3 px-4 text-lg outline-none transition-colors placeholder:text-background/40 text-background`}
                    placeholder="+91 98765 43210" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">Project Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                    className="w-full bg-background/10 border-b-2 border-background/20 focus:border-accent py-3 px-4 text-lg outline-none transition-colors placeholder:text-background/40 text-background"
                    placeholder="City, State or Address" />
                </div>
              </div>
              <div className="mt-8">
                <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">Additional Details</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4}
                  className="w-full bg-background/10 border-2 border-background/20 focus:border-accent p-4 outline-none transition-colors resize-none placeholder:text-background/40 text-background"
                  placeholder="Tell us about your project..." />
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => { if (validateStep2()) setStep(3); }}
                  className="px-8 py-4 bg-accent text-white font-mono text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-accent/90 transition-colors">
                  Review & Submit <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <div className="flex justify-between items-center mb-8">
                <button onClick={goBack} className="flex items-center gap-2 text-background/60 hover:text-accent font-mono text-sm transition-colors">
                  <ArrowLeft className="w-4 h-4" />Edit details
                </button>
                <button onClick={cancelForm} className="flex items-center gap-2 text-background/40 hover:text-accent font-mono text-sm transition-colors">
                  <X className="w-4 h-4" />Cancel
                </button>
              </div>
              <div className="border border-background/20 p-8">
                <h3 className="font-serif text-2xl mb-6">Review Your Request</h3>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between py-2 border-b border-background/10"><span className="text-background/60">Project Type</span><span className="text-accent uppercase">{formData.projectType}</span></div>
                  <div className="flex justify-between py-2 border-b border-background/10"><span className="text-background/60">Name</span><span>{formData.name}</span></div>
                  <div className="flex justify-between py-2 border-b border-background/10"><span className="text-background/60">Email</span><span>{formData.email}</span></div>
                  <div className="flex justify-between py-2 border-b border-background/10"><span className="text-background/60">Phone</span><span>{formData.phone}</span></div>
                  {formData.location && <div className="flex justify-between py-2 border-b border-background/10"><span className="text-background/60">Location</span><span>{formData.location}</span></div>}
                  {formData.message && <div className="py-2"><span className="text-background/60 block mb-2">Message</span><p className="text-background/80">{formData.message}</p></div>}
                </div>
                <button onClick={handleSubmit} disabled={isSubmitting}
                  className="mt-8 w-full px-8 py-5 bg-accent text-white font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-background/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div><p className="text-background/60 text-xs font-mono mb-1">OFFICE</p><p className="text-background font-medium text-sm">402, Titanium City Center, Ahmedabad</p></div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-background/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <div><p className="text-background/60 text-xs font-mono mb-1">CALL</p><p className="text-background font-medium text-sm">+91 98765 43210</p></div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-background/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div><p className="text-background/60 text-xs font-mono mb-1">EMAIL</p><p className="text-background font-medium text-sm">info@pruthvisurvey.com</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
