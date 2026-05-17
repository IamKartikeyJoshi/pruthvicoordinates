import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-surveyor.jpg";
import { ContentItem } from "@/lib/defaultContent";
import { HOME_DEFAULTS } from "@/lib/defaultContent";

interface Props {
  heroData?: ContentItem;
}

const HeroSection = ({ heroData }: Props) => {
  const hero = heroData?.content || HOME_DEFAULTS.find(d => d.section_key === 'hero')?.content || {};

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-24 px-4 md:px-6 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-foreground/5 hidden md:block" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-foreground/5 hidden md:block" />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Hero Text */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-foreground/10 bg-popover/50 backdrop-blur-sm animate-fade-in-up">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-foreground/60">
              {hero.badge || 'Govt. Approved Surveyors'}
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] text-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {hero.title1 || 'Mapping'} <br />
            <span className="italic text-foreground/80">{hero.title2 || 'Reality'}</span> <br />
            <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-sans font-light tracking-tighter text-foreground/60 ml-1 md:ml-4">
              {hero.subtitle || 'with absolute precision.'}
            </span>
          </h2>

          <p className="font-sans text-base md:text-xl text-foreground/70 max-w-xl leading-relaxed border-l-2 border-accent pl-4 md:pl-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {hero.description || 'We translate the physical world into precise digital data. From boundary disputes to massive infrastructure projects, our coordinates define your reality.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to={hero.cta1_link || '/services'}
              className="px-6 md:px-8 py-3 md:py-4 bg-foreground text-background font-mono text-xs sm:text-sm hover:bg-accent transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              {hero.cta1_text || 'EXPLORE SERVICES'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={hero.cta2_link || '/portfolio'}
              className="px-6 md:px-8 py-3 md:py-4 border border-foreground/20 hover:border-foreground font-mono text-xs sm:text-sm transition-all duration-300 text-center"
            >
              {hero.cta2_text || 'VIEW PORTFOLIO'}
            </Link>
          </div>
        </div>

        {/* Hero Visual - Static Image */}
        <div className="lg:col-span-5 relative h-[300px] sm:h-[400px] lg:h-[550px] w-full flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative w-full h-full border border-foreground/10 shadow-2xl lg:rotate-1 hover:rotate-0 transition-transform duration-700 ease-out overflow-hidden">
            <img 
              src={heroImage} 
              alt="Professional surveyor at work with precision equipment" 
              className="w-full h-full object-cover"
              width={1200} height={1500}
              fetchPriority="high" decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
