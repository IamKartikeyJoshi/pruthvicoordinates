const PortfolioSection = () => {
  const projects = [
    {
      title: "Metro Rail Corridor Survey",
      tag: "AHMEDABAD METRO PHASE 2",
      meta: "DGPS / TOPOGRAPHY / 12km",
      bgClass: "bg-secondary/50",
    },
    {
      title: "Smart City Urban Planning",
      tag: "GIFT CITY EXPANSION",
      meta: "CONTOUR MAPPING / 450 ACRES",
      bgClass: "bg-foreground",
      dark: true,
    },
    {
      title: "Highway Alignment",
      tag: "NATIONAL HIGHWAY 48",
      meta: "TOTAL STATION / ROW DEMARCATION",
      bgClass: "bg-secondary/30",
    },
    {
      title: "Industrial Layout",
      tag: "RELIANCE REFINERY ZONE",
      meta: "AS-BUILT SURVEY / PIPELINE MAPPING",
      bgClass: "bg-secondary/20",
    },
  ];

  return (
    <section id="portfolio" className="py-24 bg-background px-6">
      <div className="container mx-auto">
        <div className="mb-16 border-b border-foreground/10 pb-8">
          <h4 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
            Selected Works
          </h4>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground">
            Mapping the <br />
            <span className="italic text-accent">Infrastructure</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.title} className="group cursor-pointer">
              <div
                className={`h-64 md:h-80 ${project.bgClass} relative overflow-hidden mb-4 border border-foreground/10`}
              >
                <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors" />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 grid-pattern opacity-20" />
                
                {/* Abstract SVG */}
                <svg
                  className="w-full h-full opacity-20 group-hover:scale-105 transition-transform duration-700"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M10,50 Q30,30 50,50 T90,50"
                    fill="none"
                    stroke={project.dark ? "#f4f1ea" : "#1a1a1a"}
                    strokeWidth="0.5"
                  />
                  <circle cx="30" cy="40" r="2" fill="#ff3333" />
                  <circle cx="70" cy="60" r="2" fill="#ff3333" />
                </svg>

                {/* Tag */}
                <div
                  className={`absolute bottom-4 left-4 ${
                    project.dark
                      ? "bg-foreground/90 text-background"
                      : "bg-popover/90 text-foreground"
                  } backdrop-blur px-3 py-1 font-mono text-xs border-l-2 border-accent`}
                >
                  {project.tag}
                </div>
              </div>
              
              <h3 className="font-bold text-xl font-serif group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-foreground/60 font-mono mt-2">{project.meta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
