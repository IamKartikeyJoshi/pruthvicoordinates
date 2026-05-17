import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import DynamicCTA from "@/components/DynamicCTA";
import { MapPin, Phone, Mail, Clock, MessageSquare, Calendar, icons } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";

const DynIcon = ({ name, className }: { name?: string; className?: string }) => {
  const fallback = { Phone, Mail, MapPin, Clock } as any;
  if (name && (icons as any)[name]) { const I = (icons as any)[name]; return <I className={className} />; }
  const I = (fallback[name || 'Phone'] || Phone);
  return <I className={className} />;
};

const Contact = () => {
  const navigate = useNavigate();
  const { getItems, getFirst } = useSiteContent('contact');
  const hero = getFirst('hero')?.content || {};
  const contactMethods = getItems('method').map(i => i.content);
  const offices = getItems('office').map(i => i.content);
  const officeMap = getFirst('office_map')?.content || {};
  const faqs = getItems('faq').map(i => i.content);
  const emergency = getFirst('emergency')?.content || {};

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
                {hero.subtitle || 'Get in Touch'}
              </h3>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-8">
                {hero.title || "Let's Define Your"} <br />
                <span className="italic text-accent">{hero.titleAccent || 'Coordinates'}</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-foreground/70 max-w-2xl leading-relaxed mb-8">
                {hero.description || ''}
              </p>
              <Button 
                onClick={() => navigate(hero.cta_link || '/book-appointment')}
                className="bg-accent hover:bg-accent/90 text-white font-mono uppercase tracking-widest px-8 py-6 text-sm"
              >
                <Calendar className="w-5 h-5 mr-3" />
                {hero.cta_text || 'Request Appointment'}
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-background border-b border-foreground/10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method: any, i: number) => (
                <div key={i} className="p-6 border border-foreground/10 hover:border-accent transition-colors group">
                  <DynIcon name={method.icon} className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
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

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {offices.map((office: any, i: number) => (
                <div key={i} className="bg-popover p-8 border border-foreground/10">
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

            {/* Google Maps Embed - Ahmedabad Office */}
            <div className="mt-12 h-[400px] border border-foreground/10 overflow-hidden">
              <iframe
                src={officeMap.embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.0427069847776!2d72.50860231496791!3d23.02505098494685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b2b0c0b0001%3A0x0!2sTitanium%20City%20Center!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin'}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pruthvi Coordinates Office Location"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
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
                {faqs.map((faq: any, index: number) => (
                  <div key={index} className="bg-popover border border-foreground/10 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg text-foreground mb-3">{faq.question}</h4>
                        <p className="text-foreground/60 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        {emergency.title && (
        <section className="py-16 bg-accent text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="font-serif text-2xl md:text-3xl mb-4">{emergency.title}</h3>
              <p className="text-white/80 mb-6">{emergency.description}</p>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20">
                <Phone className="w-5 h-5" />
                <span className="font-mono text-lg">{emergency.phone}</span>
                <span className="font-mono text-xs opacity-70">{emergency.note}</span>
              </div>
            </div>
          </div>
        </section>
        )}
        <DynamicCTA pageKey="contact" fallback={{ heading: 'Ready to Map Your', headingAccent: 'Project?', subheading: 'Let our team know your needs and we will respond within 24 hours.', primaryText: 'Book Appointment', primaryLink: '/book-appointment' }} />
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
