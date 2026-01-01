const stats = [
  { value: "500+", label: "Projects Completed", description: "Across residential, commercial & infrastructure" },
  { value: "15+", label: "Years Experience", description: "Professional surveying expertise" },
  { value: "98%", label: "Client Satisfaction", description: "Precision and reliability guaranteed" },
  { value: "50+", label: "Corporate Clients", description: "Trusted by leading organizations" },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
            Our Track Record
          </h3>
          <h2 className="font-serif text-3xl md:text-5xl text-background mb-4">
            Numbers That <span className="italic text-background/80">Define</span> Us
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif text-4xl md:text-6xl text-accent mb-2">
                {stat.value}
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-background/80 mb-2">
                {stat.label}
              </div>
              <p className="text-background/50 text-sm hidden md:block">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
