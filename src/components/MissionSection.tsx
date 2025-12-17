const MissionSection = () => {
  const stats = [
    { label: "PROJECTS COMPLETED", value: "1,500+" },
    { label: "YEARS EXPERIENCE", value: "34" },
    { label: "CLIENT SATISFACTION", value: "100%" },
  ];

  return (
    <section id="mission" className="py-24 bg-foreground text-background relative">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
            Our Mission
          </h3>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-background">
            Defined by <br />
            <span className="italic text-background/80">Precision</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-background/20 pt-12">
          <div>
            <span className="font-mono text-accent text-sm tracking-widest block mb-4">
              01 // PRECISION
            </span>
            <p className="font-serif text-xl lg:text-2xl leading-relaxed text-background/90">
              "In our line of work, an inch is a mile. We don't just measure land; we define boundaries that stand the test of time."
            </p>
          </div>

          <div>
            <span className="font-mono text-accent text-sm tracking-widest block mb-4">
              02 // TECHNOLOGY
            </span>
            <p className="font-serif text-xl lg:text-2xl leading-relaxed text-background/90">
              Leveraging DGPS, Total Stations, and Drone Photogrammetry to deliver data with millimeter-level accuracy.
            </p>
          </div>

          <div className="font-mono space-y-6 text-sm">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex justify-between border-b border-background/10 pb-2"
              >
                <span className="text-background/70">{stat.label}</span>
                <span className="text-accent font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
