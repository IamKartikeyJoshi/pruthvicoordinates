import { ContentItem } from "@/lib/defaultContent";
import { HOME_DEFAULTS } from "@/lib/defaultContent";

interface Props {
  items?: ContentItem[];
}

const StatsSection = ({ items }: Props) => {
  const stats = items && items.length > 0 
    ? items.map(i => i.content) 
    : HOME_DEFAULTS.filter(d => d.section_key === 'stat').map(d => d.content);

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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12">
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
