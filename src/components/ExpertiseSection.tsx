import { Satellite, Camera, Layers, Ruler, Plane, Waves } from "lucide-react";

const ExpertiseSection = () => {
  const expertise = [
    {
      icon: Satellite,
      title: "DGPS Survey",
      description: "Dual-frequency GPS for geodetic control and large scale topographical mapping.",
    },
    {
      icon: Camera,
      title: "Total Station",
      description: "High-precision optical electronic distance metering for construction layout.",
    },
    {
      icon: Layers,
      title: "Contour Mapping",
      description: "Detailed elevation modeling for drainage, grading, and architectural planning.",
    },
    {
      icon: Ruler,
      title: "Boundary Layout",
      description: "Cadastral surveying to establish property lines and resolve encroachments.",
    },
    {
      icon: Plane,
      title: "LiDAR & Drone",
      description: "Aerial surveys using LiDAR and drone technology for rapid large-area mapping.",
    },
    {
      icon: Waves,
      title: "Bathymetry",
      description: "Underwater topography surveys for water bodies, ports, and marine projects.",
    },
  ];

  return (
    <section id="expertise" className="py-24 lg:py-32 bg-background px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 lg:mb-20 gap-8">
          <div>
            <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
              Technical Expertise
            </h3>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground">
              Instruments of <br />
              <span className="italic text-accent">Truth</span>
            </h2>
          </div>
          <p className="max-w-md font-sans text-foreground/60">
            We utilize a fleet of calibrated, high-end instruments ensuring that every coordinate we deliver is legally defensible and physically accurate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {expertise.map((item) => (
            <div
              key={item.title}
              className="bg-background p-8 hover:bg-popover transition-colors group cursor-crosshair"
            >
              <item.icon className="w-10 h-10 text-foreground/20 group-hover:text-accent mb-8 transition-colors" />
              <h4 className="font-bold text-xl mb-2">{item.title}</h4>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
