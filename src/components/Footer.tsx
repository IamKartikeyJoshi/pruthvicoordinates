import { Linkedin, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 border-t border-background/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-accent rounded-full blinker" />
              <h4 className="font-serif text-2xl">Pruthvi Co-ordinates</h4>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Defining the future, one coordinate at a time. Trusted by government bodies and private developers since 1989.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-mono text-xs font-bold tracking-widest text-accent mb-6 uppercase">
              Quick Links
            </h5>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="hover:text-background cursor-pointer transition-colors">Home</li>
              <li className="hover:text-background cursor-pointer transition-colors">Services</li>
              <li className="hover:text-background cursor-pointer transition-colors">Portfolio</li>
              <li className="hover:text-background cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-mono text-xs font-bold tracking-widest text-accent mb-6 uppercase">
              Legal
            </h5>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="hover:text-background cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-background cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-background cursor-pointer transition-colors">License Info</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h5 className="font-mono text-xs font-bold tracking-widest text-accent mb-6 uppercase">
              Connect
            </h5>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-background/40 gap-4">
          <p>&copy; {new Date().getFullYear()} Pruthvi Co-ordinates. All rights reserved.</p>
          <p>Designed with precision.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
