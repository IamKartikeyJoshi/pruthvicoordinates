import { ArrowRight, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 bg-foreground text-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-pattern h-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
            Ready to Get Started?
          </h3>
          <h2 className="font-serif text-4xl md:text-6xl text-background mb-6">
            Let's Map Your <span className="italic text-background/80">Success</span>
          </h2>
          <p className="text-background/60 text-lg mb-10 max-w-2xl mx-auto">
            Whether it's a small residential plot or a large infrastructure project, 
            our team delivers precision surveying you can trust.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              to="/contact"
              className="px-8 py-4 bg-accent text-white font-mono text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-accent/90 transition-all duration-300 group"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/book-appointment"
              className="px-8 py-4 border border-background/30 hover:border-background font-mono text-sm uppercase tracking-widest transition-all duration-300"
            >
              Book Consultation
            </Link>
          </div>

          {/* Contact Quick Links */}
          <div className="flex flex-wrap justify-center gap-8 text-background/60">
            <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-mono text-sm">+91 98765 43210</span>
            </a>
            <a href="mailto:pruthvinay@gmail.com" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail className="w-4 h-4" />
              <span className="font-mono text-sm">pruthvinay@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
