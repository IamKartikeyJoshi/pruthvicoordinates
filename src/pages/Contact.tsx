import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { MapPin, Phone, Mail, Clock, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      primary: "+91 98765 43210",
      secondary: "+91 79 2658 1234",
      note: "Available Mon-Sat, 9AM-7PM",
    },
    {
      icon: Mail,
      title: "Email",
      primary: "info@pruthvisurvey.com",
      secondary: "projects@pruthvisurvey.com",
      note: "Response within 24 hours",
    },
    {
      icon: MapPin,
      title: "Head Office",
      primary: "402, Titanium City Center",
      secondary: "100 Feet Ring Road, Ahmedabad",
      note: "Gujarat - 380015",
    },
    {
      icon: Clock,
      title: "Working Hours",
      primary: "Monday - Saturday",
      secondary: "9:00 AM - 7:00 PM",
      note: "Sunday by appointment",
    },
  ];

  const offices = [
    {
      city: "Ahmedabad",
      type: "Head Office",
      address: "402, Titanium City Center, 100 Feet Ring Road, Satellite, Ahmedabad - 380015",
      phone: "+91 79 2658 1234",
    },
    {
      city: "Surat",
      type: "Branch Office",
      address: "B-201, Millennium Business Park, Majura Gate, Surat - 395002",
      phone: "+91 261 245 6789",
    },
    {
      city: "Vadodara",
      type: "Branch Office",
      address: "15, Shreeji Complex, Alkapuri, Vadodara - 390007",
      phone: "+91 265 234 5678",
    },
  ];

  const faqs = [
    {
      q: "What information do I need to request a quote?",
      a: "To provide an accurate quote, we need: 1) Type of survey required, 2) Location/address of the property, 3) Approximate area or extent, 4) Any existing documents (survey plans, deeds), and 5) Your timeline requirements.",
    },
    {
      q: "How quickly can you start a project?",
      a: "For standard projects, we can typically begin field work within 3-5 business days of agreement. Emergency or rush projects can be accommodated with prior arrangement, subject to crew availability.",
    },
    {
      q: "Do you provide services outside Gujarat?",
      a: "Yes, we undertake projects across India for clients requiring our expertise. Additional mobilization charges apply for locations outside Gujarat. Contact us with your project details for a customized quote.",
    },
    {
      q: "What are your payment terms?",
      a: "We typically require 50% advance to commence work, with the balance due upon delivery of final reports. For large projects, milestone-based payment schedules can be arranged.",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden page-bg">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="grid-pattern h-full" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Get in Touch
              </h3>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-8">
                Let's Define Your <br />
                <span className="italic text-accent">Coordinates</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-foreground/70 max-w-2xl leading-relaxed mb-8">
                Ready to start your surveying project? Our team is here to help you navigate from concept to completion with precision and expertise.
              </p>
              <Button 
                onClick={() => navigate('/book-appointment')}
                className="bg-accent hover:bg-accent/90 text-white font-mono uppercase tracking-widest px-8 py-6 text-sm"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Request Appointment
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-background border-b border-foreground/10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method) => (
                <div key={method.title} className="p-6 border border-foreground/10 hover:border-accent transition-colors group">
                  <method.icon className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-mono text-xs text-foreground/40 tracking-widest uppercase mb-2">{method.title}</h3>
                  <div className="font-serif text-lg text-foreground mb-1">{method.primary}</div>
                  <div className="text-foreground/60 text-sm mb-2">{method.secondary}</div>
                  <div className="font-mono text-xs text-foreground/40">{method.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Form Section */}
        <ContactSection />

        {/* Office Locations */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Our Locations
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                Office <span className="italic text-accent">Network</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {offices.map((office) => (
                <div key={office.city} className="bg-popover p-8 border border-foreground/10">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-accent" />
                    <div>
                      <h3 className="font-serif text-xl text-foreground">{office.city}</h3>
                      <div className="font-mono text-xs text-accent tracking-widest uppercase">{office.type}</div>
                    </div>
                  </div>
                  <p className="text-foreground/60 mb-4">{office.address}</p>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Phone className="w-4 h-4" />
                    <span className="font-mono text-sm">{office.phone}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-12 h-[400px] bg-foreground/5 border border-foreground/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/40 font-mono text-sm">Interactive Map</p>
                <p className="text-foreground/30 text-xs mt-1">Coming Soon</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                  Questions?
                </h3>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                  Frequently <span className="italic text-accent">Asked</span>
                </h2>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-popover border border-foreground/10 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg text-foreground mb-3">{faq.q}</h4>
                        <p className="text-foreground/60 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-16 bg-accent text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="font-serif text-2xl md:text-3xl mb-4">
                Urgent Survey Requirement?
              </h3>
              <p className="text-white/80 mb-6">
                For time-critical projects or emergency survey needs, call our priority line directly. We offer expedited services for urgent requirements.
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20">
                <Phone className="w-5 h-5" />
                <span className="font-mono text-lg">+91 98765 00000</span>
                <span className="font-mono text-xs opacity-70">24/7 Priority Line</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
