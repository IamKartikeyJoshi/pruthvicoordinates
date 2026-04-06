import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Target, Users, Clock, Shield, Compass, Loader2, MapPin, Star, Zap, icons } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import surveyFieldwork from "@/assets/survey-fieldwork.jpg";

const DynamicIcon = ({ name, ...props }: { name?: string; className?: string }) => {
  if (!name) return <Target {...props} />;
  const IconComp = (icons as any)[name];
  if (IconComp) return <IconComp {...props} />;
  return <Target {...props} />;
};

const Mission = () => {
  const { getItems, getFirst, loading } = useSiteContent('mission');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const hero = getFirst('hero')?.content || {};
  const stats = getItems('stats').map(i => i.content);
  const philosophy = getFirst('philosophy')?.content || {};
  const values = getItems('value').map(i => i.content);
  const milestones = getItems('milestone').map(i => i.content);
  const team = getItems('team').map(i => i.content);

  const iconMap: Record<string, any> = { Target, Clock, Award, Users, Shield, Compass };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden page-bg">
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src={surveyFieldwork} alt="Survey fieldwork" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-foreground/80" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
                {hero.subtitle || 'Our Mission'}
              </h3>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-background mb-6 md:mb-8">
                {hero.title || 'Defined by'} <br />
                <span className="italic text-background/80">{hero.titleAccent || 'Precision'}</span>
              </h1>
              <p className="font-sans text-lg md:text-2xl text-background/70 max-w-2xl leading-relaxed">
                {hero.description || ''}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 md:py-16 bg-background border-b border-foreground/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <DynamicIcon name={stat.icon} className="w-6 h-6 md:w-8 md:h-8 text-accent mx-auto mb-3" />
                  <div className="font-serif text-3xl md:text-5xl text-foreground mb-2">{stat.value}</div>
                  <div className="font-mono text-[10px] md:text-xs tracking-widest text-foreground/50 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div>
                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Our Philosophy</h3>
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-6 md:mb-8">
                  {philosophy.title ? philosophy.title.split(' ').slice(0, -1).join(' ') : 'The Art of'} <br />
                  <span className="italic text-accent">{philosophy.title ? philosophy.title.split(' ').slice(-1)[0] : 'Measurement'}</span>
                </h2>
                <div className="space-y-4 md:space-y-6 text-foreground/70 text-base md:text-lg leading-relaxed">
                  {(philosophy.description || '').split('\n\n').map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="bg-popover p-6 md:p-8 border border-foreground/10">
                <blockquote className="font-serif text-xl md:text-3xl text-foreground italic leading-relaxed mb-6">
                  "{philosophy.quote || ''}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-foreground/10 rounded-full flex items-center justify-center font-serif text-xl md:text-2xl text-accent">
                    {(philosophy.quoteName || 'RP').split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm md:text-base">{philosophy.quoteName || ''}</div>
                    <div className="font-mono text-[10px] md:text-xs text-foreground/50">{philosophy.quoteRole || ''}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 md:mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Core Values</h3>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground">
                What We <br /><span className="italic text-accent">Stand For</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {values.map((value, i) => (
                <div key={i} className="bg-popover p-6 md:p-8 border-l-4 border-accent hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <span className="font-mono text-3xl md:text-4xl text-foreground/10 font-bold">{value.number || `0${i + 1}`}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 md:mb-4">{value.title}</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm md:text-base">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 md:mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">Our Journey</h3>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground">
                34 Years of <br /><span className="italic text-accent">Excellence</span>
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-2 md:left-1/2 top-0 bottom-0 w-px bg-foreground/10 transform md:-translate-x-1/2" />
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-8 md:mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"} pl-8 md:pl-0`}>
                    <div className="font-mono text-accent text-sm tracking-widest mb-1 md:mb-2">{milestone.year}</div>
                    <p className="text-foreground/70 text-base md:text-lg">{milestone.event}</p>
                  </div>
                  <div className="absolute left-2 md:left-1/2 w-3 h-3 md:w-4 md:h-4 bg-accent rounded-full transform -translate-x-1/2 border-4 border-background" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24 bg-foreground text-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 md:mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">Leadership Team</h3>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-background">
                The Experts <br /><span className="italic text-background/80">Behind the Data</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {team.map((member, i) => (
                <div key={i} className="border border-background/20 p-5 md:p-6 hover:border-accent transition-colors group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-background/10 rounded-full flex items-center justify-center font-serif text-xl md:text-2xl text-accent mb-4 md:mb-6 group-hover:bg-accent/20 transition-colors">
                    {(member.name || '').split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <h3 className="font-serif text-lg md:text-xl text-background mb-1">{member.name}</h3>
                  <div className="font-mono text-[10px] md:text-xs text-accent mb-3 md:mb-4">{member.role}</div>
                  <div className="space-y-2 text-xs md:text-sm text-background/60">
                    <div className="flex justify-between"><span>Experience:</span><span className="text-background/80">{member.experience}</span></div>
                    <div className="flex justify-between"><span>Specialty:</span><span className="text-background/80">{member.specialty}</span></div>
                  </div>
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-background/10 font-mono text-[10px] text-background/40">{member.license}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4 md:mb-6">
                Ready to Work with <span className="italic text-accent">Precision</span>?
              </h2>
              <p className="text-foreground/60 text-base md:text-lg mb-6 md:mb-8">
                Whether you need boundary demarcation, topographical surveys, or complex geodetic networks, our team is ready to deliver results you can trust.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-foreground text-background font-mono text-xs md:text-sm uppercase tracking-widest hover:bg-accent transition-colors group">
                Start Your Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      <Footer />
    </div>
  );
};

export default Mission;
