import { Building2, Landmark, Factory, Home, TreePine, Truck } from "lucide-react";

const clientTypes = [
  { icon: Building2, name: "Real Estate Developers", description: "Land acquisition & site planning" },
  { icon: Landmark, name: "Government Bodies", description: "Infrastructure & municipal projects" },
  { icon: Factory, name: "Industrial Sector", description: "Factory layouts & compliance" },
  { icon: Home, name: "Individual Landowners", description: "Boundary disputes & documentation" },
  { icon: TreePine, name: "Agriculture", description: "Farm mapping & land records" },
  { icon: Truck, name: "Construction Companies", description: "As-built & progress surveys" },
];

const ClientsSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
            Who We Serve
          </h3>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
            Trusted By <span className="italic text-foreground/80">Industry Leaders</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            From individual landowners to government agencies, we provide precision surveying services across all sectors.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {clientTypes.map((client, index) => (
            <div
              key={index}
              className="group p-6 border border-foreground/10 hover:border-accent hover:bg-accent/5 transition-all duration-300 text-center"
            >
              <client.icon className="w-10 h-10 mx-auto mb-4 text-foreground/60 group-hover:text-accent transition-colors" />
              <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/80 mb-2">
                {client.name}
              </h4>
              <p className="text-foreground/50 text-xs hidden md:block">
                {client.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
