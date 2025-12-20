import { useState } from "react";
import { Send, MapPin, Phone, Mail, CheckCircle, ArrowRight, ArrowLeft, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");

  const projectTypes = [
    { id: "topographical", label: "Topographical Survey", icon: "📍" },
    { id: "boundary", label: "Boundary Demarcation", icon: "🔲" },
    { id: "dgps", label: "DGPS Control Survey", icon: "📡" },
    { id: "asbuilt", label: "As-Built Survey", icon: "🏗️" },
    { id: "contour", label: "Contour Mapping", icon: "🗺️" },
    { id: "lidar", label: "LiDAR Survey", icon: "📊" },
    { id: "drone", label: "Drone Survey", icon: "🚁" },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const refCode = `PRU-${Date.now().toString(36).toUpperCase()}`;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          project_type: formData.projectType,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location || null,
          message: formData.message || null,
          reference_code: refCode,
        });

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-contact-email', {
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            projectType: formData.projectType,
            location: formData.location,
            message: formData.message,
            referenceCode: refCode,
          },
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the submission if email fails
      }

      setReferenceCode(refCode);
      setSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
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

  const cancelForm = () => {
    setStep(1);
    setFormData({
      projectType: "",
      name: "",
      email: "",
      phone: "",
      location: "",
      message: "",
    });
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
            <p className="text-background/70 text-lg mb-8">
              Thank you, <span className="text-accent font-semibold">{formData.name}</span>! 
              Our team will review your <span className="font-mono text-sm">{formData.projectType}</span> requirements 
              and reach out within 24 hours.
            </p>
            <div className="font-mono text-xs text-background/50 border border-background/20 inline-block px-4 py-2">
              REF: {referenceCode}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 bg-foreground text-background relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-pattern h-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
              Start Your Project
            </h3>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-background mb-6">
              Let's Define Your <br />
              <span className="italic text-background/80">Coordinates</span>
            </h2>
            <p className="text-background/60 max-w-lg mx-auto">
              Begin your precision surveying project in just a few steps. Our streamlined process ensures we understand your needs perfectly.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 font-mono text-xs">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-accent" : "text-background/40"}`}>
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? "border-accent bg-accent/20" : "border-background/20"}`}>
                  1
                </span>
                <span className="hidden sm:inline">PROJECT TYPE</span>
              </div>
              <div className={`w-12 h-px ${step >= 2 ? "bg-accent" : "bg-background/20"}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-accent" : "text-background/40"}`}>
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? "border-accent bg-accent/20" : "border-background/20"}`}>
                  2
                </span>
                <span className="hidden sm:inline">YOUR DETAILS</span>
              </div>
              <div className={`w-12 h-px ${step >= 3 ? "bg-accent" : "bg-background/20"}`} />
              <div className={`flex items-center gap-2 ${step >= 3 ? "text-accent" : "text-background/40"}`}>
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 3 ? "border-accent bg-accent/20" : "border-background/20"}`}>
                  3
                </span>
                <span className="hidden sm:inline">CONFIRM</span>
              </div>
            </div>
          </div>

          {/* Step 1: Project Type */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h3 className="text-center font-serif text-2xl mb-8 text-background/80">
                What type of survey do you need?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleProjectSelect(type.id)}
                    className="p-6 border border-background/20 hover:border-accent hover:bg-accent/10 transition-all duration-300 text-left group"
                  >
                    <span className="text-3xl mb-4 block">{type.icon}</span>
                    <span className="font-sans text-sm font-semibold group-hover:text-accent transition-colors">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-background/60 hover:text-accent mb-8 font-mono text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to project type
              </button>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b-2 border-background/20 focus:border-accent py-3 text-lg outline-none transition-colors placeholder:text-background/30"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b-2 border-background/20 focus:border-accent py-3 text-lg outline-none transition-colors placeholder:text-background/30"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b-2 border-background/20 focus:border-accent py-3 text-lg outline-none transition-colors placeholder:text-background/30"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">
                    Project Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b-2 border-background/20 focus:border-accent py-3 text-lg outline-none transition-colors placeholder:text-background/30"
                    placeholder="City, State or Address"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="block font-mono text-xs text-background/60 mb-2 uppercase tracking-widest">
                  Additional Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-transparent border-2 border-background/20 focus:border-accent p-4 outline-none transition-colors resize-none placeholder:text-background/30"
                  placeholder="Tell us about your project requirements, timeline, or any specific concerns..."
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.name || !formData.email || !formData.phone}
                  className="px-8 py-4 bg-accent text-white font-mono text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Submit
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-background/60 hover:text-accent font-mono text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit details
                </button>
                <button
                  onClick={cancelForm}
                  className="flex items-center gap-2 text-background/40 hover:text-accent font-mono text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>

              <div className="border border-background/20 p-8">
                <h3 className="font-serif text-2xl mb-6">Review Your Request</h3>
                
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between py-2 border-b border-background/10">
                    <span className="text-background/60">Project Type</span>
                    <span className="text-accent uppercase">{formData.projectType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-background/10">
                    <span className="text-background/60">Name</span>
                    <span>{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-background/10">
                    <span className="text-background/60">Email</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-background/10">
                    <span className="text-background/60">Phone</span>
                    <span>{formData.phone}</span>
                  </div>
                  {formData.location && (
                    <div className="flex justify-between py-2 border-b border-background/10">
                      <span className="text-background/60">Location</span>
                      <span>{formData.location}</span>
                    </div>
                  )}
                  {formData.message && (
                    <div className="py-2">
                      <span className="text-background/60 block mb-2">Message</span>
                      <p className="text-background/80">{formData.message}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="mt-8 w-full px-8 py-5 bg-accent text-white font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent/90 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  {isSubmitting ? "Submitting..." : "Submit Project Request"}
                </button>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-16 pt-12 border-t border-background/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="w-12 h-12 border border-background/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-mono text-xs text-background/60 uppercase tracking-widest mb-1">Phone</h4>
                  <p className="text-background">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="w-12 h-12 border border-background/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-mono text-xs text-background/60 uppercase tracking-widest mb-1">Email</h4>
                  <p className="text-background">info@pruthvisurvey.com</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="w-12 h-12 border border-background/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-mono text-xs text-background/60 uppercase tracking-widest mb-1">Office</h4>
                  <p className="text-background">402, Titanium City Center, Ahmedabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
