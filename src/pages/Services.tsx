import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle, FileText, Users, Loader2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import surveyInfrastructure from "@/assets/survey-infrastructure.jpg";

const Services = () => {
  const { getItems, getFirst, loading } = useSiteContent('services');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const hero = getFirst('hero')?.content || {};
  const services = getItems('service').map(i => i.content);
  const process = getItems('process').map(i => i.content);
  const faqs = getItems('faq').map(i => i.content);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden page-bg">
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 bg-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src={surveyInfrastructure} alt="Infrastructure" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-secondary/60" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">{hero.subtitle || 'Scope of Work'}</h3>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-8">
                {hero.title || 'Our Core'} <br /><span className="italic text-accent">{hero.titleAccent || 'Services'}</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-foreground/70 max-w-2xl leading-relaxed">{hero.description || ''}</p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-24 bg-background relative z-10">
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              {services.map((service, i) => {
                const deliverables = typeof service.deliverables === 'string'
                  ? service.deliverables.split(',').map((d: string) => d.trim())
                  : service.deliverables || [];
                return (
                  <div key={i} className="border border-foreground/10 bg-popover">
                    <div className="p-8 lg:p-12">
                      <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7">
                          <div className="flex items-start gap-6 mb-6">
                            <span className="font-mono text-5xl text-foreground/10 font-bold">{String(i + 1).padStart(2, '0')}</span>
                            <div>
                              <h3 className="font-serif text-3xl text-foreground mb-2">{service.title}</h3>
                              <div className="font-mono text-xs text-accent tracking-widest uppercase">{service.subtitle}</div>
                            </div>
                          </div>
                          <p className="text-foreground/60 text-lg leading-relaxed mb-8">{service.description}</p>
                          <div className="flex flex-wrap gap-6 text-sm">
                            {service.timeline && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent" /><span className="text-foreground/70">{service.timeline}</span>
                              </div>
                            )}
                            {service.idealFor && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-accent" /><span className="text-foreground/70">{service.idealFor}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="lg:col-span-5 bg-secondary/30 p-6 border border-foreground/5">
                          <div className="font-mono text-xs text-foreground/40 mb-4 tracking-widest uppercase flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Deliverables
                          </div>
                          <ul className="space-y-3">
                            {deliverables.map((item: string, j: number) => (
                              <li key={j} className="flex items-start gap-3 text-foreground/70">
                                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /><span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">How We Work</h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background">Our <span className="italic text-background/80">Process</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {process.map((item, index) => (
                <div key={index} className="relative">
                  <div className="font-mono text-6xl text-background/10 font-bold mb-4">{item.step || String(index + 1).padStart(2, '0')}</div>
                  <h3 className="font-serif text-xl text-background mb-3">{item.title}</h3>
                  <p className="text-background/60 text-sm leading-relaxed">{item.description}</p>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-8 -right-4 w-8">
                      <ArrowRight className="w-6 h-6 text-accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Common Questions</h3>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground">Frequently <span className="italic text-accent">Asked</span></h2>
              </div>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-foreground/10 p-6">
                    <h4 className="font-serif text-lg text-foreground mb-3">{faq.question}</h4>
                    <p className="text-foreground/60">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-popover border-t border-foreground/10">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Ready to Get <span className="italic text-accent">Started</span>?</h2>
              <p className="text-foreground/60 text-lg mb-8">Tell us about your project and we will provide a detailed proposal within 24 hours.</p>
              <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-accent transition-colors group">
                Request a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
