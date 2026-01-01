import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveCoordinateDisplay from "./InteractiveCoordinateDisplay";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-24 px-4 md:px-6 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-foreground/5" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-foreground/5" />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Hero Text */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-foreground/10 bg-popover/50 backdrop-blur-sm animate-fade-in-up">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-mono text-xs tracking-widest uppercase text-foreground/60">
              Govt. Approved Surveyors
            </span>
          </div>

          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] text-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Mapping <br />
            <span className="italic text-foreground/80">Reality</span> <br />
            <span className="text-3xl md:text-5xl lg:text-6xl font-sans font-light tracking-tighter text-foreground/60 ml-1 md:ml-4">
              with absolute precision.
            </span>
          </h2>

          <p className="font-sans text-lg md:text-xl text-foreground/70 max-w-xl leading-relaxed border-l-2 border-accent pl-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            We translate the physical world into precise digital data. From boundary disputes to massive infrastructure projects, our coordinates define your reality.
          </p>

          <div className="flex flex-wrap gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/services"
              className="px-8 py-4 bg-foreground text-background font-mono text-sm hover:bg-accent transition-all duration-300 flex items-center gap-3 group"
            >
              EXPLORE SERVICES 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/portfolio"
              className="px-8 py-4 border border-foreground/20 hover:border-foreground font-mono text-sm transition-all duration-300"
            >
              VIEW PORTFOLIO
            </Link>
          </div>
        </div>

        {/* Hero Visual - Interactive Coordinate Display */}
        <div className="lg:col-span-5 relative h-[400px] lg:h-[550px] w-full flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative w-full h-full border border-foreground/10 shadow-2xl lg:rotate-1 hover:rotate-0 transition-transform duration-700 ease-out overflow-hidden">
            <InteractiveCoordinateDisplay />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
