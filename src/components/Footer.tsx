import { Link } from "react-router-dom";
import { Linkedin, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 border-t border-background/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-accent rounded-full blinker" />
              <h4 className="font-serif text-2xl">Pruthvi Co-ordinates</h4>
            </Link>
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
              <li>
                <Link to="/" className="hover:text-background transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/mission" className="hover:text-background transition-colors">Mission</Link>
              </li>
              <li>
                <Link to="/expertise" className="hover:text-background transition-colors">Expertise</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-background transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-background transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-background transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="font-mono text-xs font-bold tracking-widest text-accent mb-6 uppercase">
              Services
            </h5>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="hover:text-background cursor-pointer transition-colors">Topographical Survey</li>
              <li className="hover:text-background cursor-pointer transition-colors">Boundary Demarcation</li>
              <li className="hover:text-background cursor-pointer transition-colors">DGPS Control Survey</li>
              <li className="hover:text-background cursor-pointer transition-colors">Drone Aerial Survey</li>
              <li className="hover:text-background cursor-pointer transition-colors">As-Built Documentation</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h5 className="font-mono text-xs font-bold tracking-widest text-accent mb-6 uppercase">
              Connect
            </h5>
            <div className="flex gap-4 mb-6">
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
            <div className="text-sm text-background/60">
              <p>info@pruthvisurvey.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-background/40 gap-4">
          <p>&copy; {new Date().getFullYear()} Pruthvi Co-ordinates. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-background cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-background cursor-pointer transition-colors">Terms of Service</span>
          </div>
          <p>Designed with precision.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
