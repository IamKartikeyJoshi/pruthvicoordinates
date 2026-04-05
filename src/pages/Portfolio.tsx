import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Ruler, Award, Loader2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import surveyInfrastructure from "@/assets/survey-infrastructure.jpg";
import surveyDrone from "@/assets/survey-drone.jpg";
import surveyFieldwork from "@/assets/survey-fieldwork.jpg";

const projectImages = [surveyInfrastructure, surveyDrone, surveyFieldwork];
const bgClasses = [
  "bg-gradient-to-br from-blue-900/20 to-slate-900/40",
  "bg-gradient-to-br from-amber-900/20 to-orange-900/40",
  "bg-gradient-to-br from-cyan-900/20 to-teal-900/40",
];

const Portfolio = () => {
  const { getItems, getFirst, loading } = useSiteContent('portfolio');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const hero = getFirst('hero')?.content || {};
  const projects = getItems('project').map(i => i.content);
  const categories = getItems('category').map(i => i.content);
  const clients = getItems('client').map(i => i.content);
  const testimonials = getItems('testimonial').map(i => i.content);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden page-bg">
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"><div className="grid-pattern h-full" /></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">{hero.subtitle || 'Selected Works'}</h3>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-background mb-8">
                {hero.title || 'Mapping the'} <br /><span className="italic text-background/80">{hero.titleAccent || 'Infrastructure'}</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-background/70 max-w-2xl leading-relaxed">{hero.description || ''}</p>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Featured Projects</h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">Landmark <span className="italic text-accent">Work</span></h2>
            </div>
            <div className="space-y-12">
              {projects.map((project, index) => {
                const services = typeof project.services === 'string'
                  ? project.services.split(',').map((s: string) => s.trim())
                  : project.services || [];
                return (
                  <div key={index} className="border border-foreground/10 overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                      <div className={`${bgClasses[index % bgClasses.length]} p-12 min-h-[400px] flex flex-col justify-end relative overflow-hidden`}>
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-40" loading="lazy" />
                        ) : (
                          <img src={projectImages[index % projectImages.length]} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
                        )}
                        <div className="relative z-10">
                          <div className="font-mono text-7xl text-white/10 font-bold mb-4">0{index + 1}</div>
                          <div className="inline-block px-3 py-1 bg-accent text-white font-mono text-xs tracking-widest uppercase mb-4">{project.category}</div>
                          <h3 className="font-serif text-3xl md:text-4xl text-white">{project.title}</h3>
                        </div>
                      </div>
                      <div className="p-8 lg:p-12 bg-popover">
                        <div className="flex flex-wrap gap-6 mb-6 text-sm text-foreground/60">
                          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" />{project.location}</div>
                          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" />{project.year}</div>
                          <div className="flex items-center gap-2"><Ruler className="w-4 h-4 text-accent" />{project.area}</div>
                        </div>
                        <p className="text-foreground/70 text-lg leading-relaxed mb-6">{project.description}</p>
                        <div className="mb-6">
                          <div className="font-mono text-xs text-foreground/40 mb-3 tracking-widest uppercase">Services Provided</div>
                          <div className="flex flex-wrap gap-2">
                            {services.map((service: string, j: number) => (
                              <span key={j} className="px-3 py-1 bg-foreground/5 text-foreground/70 font-mono text-xs">{service}</span>
                            ))}
                          </div>
                        </div>
                        {project.highlight && (
                          <div className="p-4 bg-accent/10 border-l-4 border-accent">
                            <div className="flex items-start gap-3">
                              <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-mono text-xs text-accent mb-1 tracking-widest uppercase">Key Achievement</div>
                                <p className="text-foreground/80">{project.highlight}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">By Sector</h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">Industry <span className="italic text-accent">Experience</span></h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((cat, i) => {
                const projectList = typeof cat.projects === 'string'
                  ? cat.projects.split(',').map((p: string) => p.trim())
                  : cat.projects || [];
                return (
                  <div key={i} className="bg-popover p-8 border border-foreground/10 hover:border-accent transition-colors">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="font-serif text-2xl text-foreground">{cat.name}</h3>
                      <span className="font-mono text-3xl text-accent font-bold">{cat.count}</span>
                    </div>
                    <p className="text-foreground/60 mb-6">{cat.description}</p>
                    <div className="space-y-2">
                      <div className="font-mono text-xs text-foreground/40 tracking-widest uppercase mb-3">Notable Projects</div>
                      {projectList.map((project: string, j: number) => (
                        <div key={j} className="flex items-center gap-2 text-foreground/70 text-sm">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full" />{project}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Clients */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Trusted By</h3>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Our <span className="italic text-accent">Clients</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {clients.map((client, i) => (
                <div key={i} className="text-center p-6 border border-foreground/10 hover:border-accent transition-colors group">
                  <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                    <span className="font-serif text-xl text-foreground/30 group-hover:text-accent transition-colors">
                      {(client.name || '').split(" ").map((w: string) => w[0]).join("")}
                    </span>
                  </div>
                  <h4 className="font-sans font-semibold text-foreground mb-1">{client.name}</h4>
                  <div className="font-mono text-xs text-foreground/50">{client.type}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">Client Feedback</h3>
              <h2 className="font-serif text-4xl md:text-5xl text-background">Words of <span className="italic text-background/80">Trust</span></h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="border border-background/20 p-8">
                  <div className="font-serif text-6xl text-accent/30 mb-4">"</div>
                  <blockquote className="font-serif text-lg text-background/90 italic mb-6 leading-relaxed">{t.quote}</blockquote>
                  <div>
                    <div className="font-bold text-background">{t.author}</div>
                    <div className="font-mono text-xs text-background/50">{t.position}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Your Project Could Be <span className="italic text-accent">Next</span></h2>
              <p className="text-foreground/60 text-lg mb-8">Join the hundreds of clients who trust Pruthvi Co-ordinates for their surveying needs.</p>
              <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-accent transition-colors group">
                Start Your Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
