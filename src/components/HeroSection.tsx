import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

        {/* Hero Visual */}
        <div className="lg:col-span-5 relative h-[400px] lg:h-[600px] w-full flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative w-full h-full border border-foreground/10 bg-popover p-4 shadow-2xl lg:rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
            {/* Total Station UI Simulator */}
            <div className="absolute left-2 lg:-left-4 top-16 z-20 bg-popover/95 backdrop-blur-md p-3 lg:p-4 shadow-xl border border-foreground/10 max-w-[220px] lg:max-w-[260px]">
              <div className="flex justify-between items-end mb-2">
                <h4 className="font-mono text-xs font-bold text-foreground/40">TS-16 OPTICAL</h4>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  <div className="w-1 h-1 bg-foreground/20 rounded-full" />
                  <div className="w-1 h-1 bg-foreground/20 rounded-full" />
                </div>
              </div>

              {/* Digital Data Readout */}
              <div className="bg-foreground p-4 font-mono text-xs shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                <div className="flex justify-between border-b border-background/20 pb-2 mb-2">
                  <span className="text-background/50 text-[10px]">MODE: DIST</span>
                  <span className="text-green-400 text-[10px] animate-pulse">BAT 98%</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-background/60 font-bold">V :</span>
                    <span className="text-background text-sm tracking-wider">92°45'12"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-background/60 font-bold">HR:</span>
                    <span className="text-background text-sm tracking-wider">145°30'05"</span>
                  </div>
                  <div className="flex justify-between items-center bg-background/10 p-1 -mx-1">
                    <span className="text-accent font-bold">SD:</span>
                    <span className="text-accent text-lg tracking-widest font-bold drop-shadow-[0_0_5px_rgba(255,51,51,0.5)]">
                      1,245.892 m
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-background/20 flex justify-between text-[9px] text-background/50">
                  <span>PPM: 0</span>
                  <span>PRISM: 0mm</span>
                </div>
              </div>

              {/* Soft Keys */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {["MEAS", "SHV", "0SET", "COORD"].map((key) => (
                  <div
                    key={key}
                    className="h-6 bg-foreground/5 flex items-center justify-center text-[8px] font-mono text-foreground/60 border border-foreground/10 cursor-pointer hover:bg-foreground/10 transition-colors"
                  >
                    {key}
                  </div>
                ))}
              </div>
            </div>

            {/* Map Layer */}
            <div className="w-full h-full bg-secondary/30 relative overflow-hidden">
              {/* Contour Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,40 50,50 T100,50" fill="none" stroke="currentColor" className="text-soil" strokeWidth="0.5" />
                <path d="M0,60 Q25,50 50,60 T100,60" fill="none" stroke="currentColor" className="text-soil" strokeWidth="0.5" />
                <path d="M0,70 Q25,60 50,70 T100,70" fill="none" stroke="currentColor" className="text-soil" strokeWidth="0.5" />
                <path d="M0,80 Q25,70 50,80 T100,80" fill="none" stroke="currentColor" className="text-soil" strokeWidth="0.5" />
              </svg>

              {/* Grid Overlay */}
              <div className="absolute inset-0 grid-pattern opacity-50 mix-blend-multiply" />

              {/* Active Survey Point */}
              <div className="absolute top-1/3 right-1/4">
                <div className="w-4 h-4 border-2 border-accent rounded-full flex items-center justify-center relative">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  <div className="absolute w-8 h-8 border border-accent/30 rounded-full marker-ping" />
                </div>
                <div className="absolute left-6 top-0 bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
                  PT: 1045 <br /> EL: 45.2m
                </div>
              </div>

              {/* Secondary Point */}
              <div className="absolute bottom-1/4 left-1/3">
                <div className="w-3 h-3 border-2 border-measure rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-measure rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
