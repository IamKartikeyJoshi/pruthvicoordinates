const ServicesSection = () => {
  const services = [
    {
      number: "01",
      title: "Topographical Survey",
      subtitle: "For Architects & Urban Planners",
    },
    {
      number: "02",
      title: "Demarcation",
      subtitle: "Legal Boundary Identification",
    },
    {
      number: "03",
      title: "Plotting & Layout",
      subtitle: "Subdivision & Infrastructure Marking",
    },
    {
      number: "04",
      title: "DGPS Control Survey",
      subtitle: "Geodetic Network Establishment",
    },
    {
      number: "05",
      title: "As-Built Survey",
      subtitle: "Construction Verification & Documentation",
    },
  ];

  return (
    <section id="services" className="py-24 bg-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 lg:mb-20">
          <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
            Scope of Work
          </h3>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground">
            Our Core <br />
            <span className="italic text-accent">Services</span>
          </h2>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.number}
              className="group bg-popover p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-xl transition-all duration-500 border-l-4 border-transparent hover:border-accent cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <span className="font-mono text-3xl md:text-4xl text-foreground/10 font-bold group-hover:text-accent transition-colors">
                  {service.number}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-serif group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-foreground/50 text-sm mt-1">{service.subtitle}</p>
                </div>
              </div>
              <span className="mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity text-accent font-mono text-sm uppercase tracking-widest">
                Learn More →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
