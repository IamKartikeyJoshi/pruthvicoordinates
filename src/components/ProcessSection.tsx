import { ClipboardList, Compass, FileCheck, Send, LucideIcon } from "lucide-react";
import { ContentItem, HOME_DEFAULTS } from "@/lib/defaultContent";

const iconMap: Record<string, LucideIcon> = {
  ClipboardList, Compass, FileCheck, Send,
};

interface Props {
  items?: ContentItem[];
}

const ProcessSection = ({ items }: Props) => {
  const steps = items && items.length > 0
    ? items.map(i => i.content)
    : HOME_DEFAULTS.filter(d => d.section_key === 'process').map(d => d.content);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
            How We Work
          </h3>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
            Simple <span className="italic text-foreground/80">Process</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            From initial consultation to final delivery, we ensure a seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.icon] || ClipboardList;
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-foreground/10" />
                )}
                <div className="relative z-10 text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-accent bg-background mb-4">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <div className="font-mono text-xs text-accent mb-2">{step.number}</div>
                  <h4 className="font-serif text-xl text-foreground mb-2">{step.title}</h4>
                  <p className="text-foreground/60 text-sm">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
