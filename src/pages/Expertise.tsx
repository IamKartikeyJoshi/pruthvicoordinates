import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Award, CheckCircle, FileCheck, Loader2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import surveyTotalstation from "@/assets/survey-totalstation.jpg";
import surveyDgps from "@/assets/survey-dgps.jpg";
import surveyDrone from "@/assets/survey-drone.jpg";
import surveyLevel from "@/assets/survey-level.jpg";
import expertiseHero from "@/assets/expertise-hero.jpg";

const defaultImages = [surveyTotalstation, surveyDgps, surveyDrone, surveyLevel];

const Expertise = () => {
  const { getItems, getFirst, loading } = useSiteContent('expertise');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const hero = getFirst('hero')?.content || {};
  const equipment = getItems('equipment').map(i => i.content);
  const methodologies = getItems('methodology').map(i => i.content);
  const software = getItems('software').map(i => i.content);
  const certifications = getItems('certification').map(i => i.content);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden page-bg">
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={hero.hero_image || expertiseHero} 
              alt="Expertise hero" 
              className="w-full h-full object-cover"
              width={1920} height={1080}
            />
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">{hero.subtitle || 'Technical Expertise'}</h3>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-8">
                {hero.title || 'Instruments of'} <br /><span className="italic text-accent">{hero.titleAccent || 'Truth'}</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-foreground/70 max-w-2xl leading-relaxed">{hero.description || ''}</p>
            </div>
          </div>
        </section>

        {/* Equipment with Images */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Our Arsenal</h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
                Survey-Grade <br /><span className="italic text-accent">Equipment</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {equipment.map((item, i) => (
                <div key={i} className="bg-popover border border-foreground/10 hover:border-accent transition-all duration-300 group overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={item.image_url || defaultImages[i % defaultImages.length]} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy" width={1920} height={1080}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="font-mono text-xs text-accent tracking-widest uppercase">{item.category}</div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors mb-3">{item.name}</h3>
                    <p className="text-foreground/60 leading-relaxed mb-4">{item.description}</p>
                    <div className="font-mono text-sm bg-foreground/5 px-4 py-2 inline-block">
                      <span className="text-foreground/40">Accuracy: </span>
                      <span className="text-accent">{item.accuracy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodologies */}
        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">Methodologies</h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background">
                Scientific <br /><span className="italic text-background/80">Approaches</span>
              </h2>
            </div>
            <div className="space-y-6">
              {methodologies.map((method, i) => {
                const apps = typeof method.applications === 'string' 
                  ? method.applications.split(',').map((a: string) => a.trim())
                  : method.applications || [];
                return (
                  <div key={i} className="bg-background/5 p-8 border border-background/10 hover:border-accent transition-all duration-300">
                    <div className="grid lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-1">
                        <span className="font-mono text-4xl text-background/20 font-bold">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="lg:col-span-7">
                        <h3 className="font-serif text-2xl text-background mb-4">{method.title}</h3>
                        <p className="text-background/60 leading-relaxed">{method.description}</p>
                      </div>
                      <div className="lg:col-span-4">
                        <div className="font-mono text-xs text-accent mb-3 tracking-widest uppercase">Applications</div>
                        <ul className="space-y-2">
                          {apps.map((app: string, j: number) => (
                            <li key={j} className="text-background/70 text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-accent rounded-full" />{app}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Software */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Software Stack</h3>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
                  Data Processing <br /><span className="italic text-accent">Excellence</span>
                </h2>
                <p className="text-foreground/60 text-lg leading-relaxed">
                  Raw field data is only as valuable as the processing behind it. We utilize industry-leading software for data reduction, analysis, and deliverable generation.
                </p>
              </div>
              <div className="bg-popover p-8 border border-foreground/10">
                <div className="font-mono text-xs text-foreground/40 mb-6 tracking-widest uppercase">Software Proficiency</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {software.map((sw, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-foreground/5">
                      <span className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-foreground/80 font-mono text-sm">{sw.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Credentials</h3>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Licensed & <span className="italic text-accent">Certified</span></h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certifications.map((cert, i) => (
                <div key={i} className="text-center p-8 border border-foreground/10 hover:border-accent transition-colors group">
                  <Award className="w-12 h-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-serif text-lg text-foreground mb-2">{cert.name}</h3>
                  <div className="font-mono text-xs text-foreground/50">{cert.authority}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Experience <span className="italic text-accent">Precision</span></h2>
              <p className="text-foreground/60 text-lg mb-8">Discover how our technical capabilities can serve your project needs.</p>
              <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-accent transition-colors group">
                Discuss Your Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Expertise;
