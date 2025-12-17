import { useState } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onNavigate: (section: string) => void;
}

const Header = ({ onNavigate }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", section: "home" },
    { label: "Mission", section: "mission" },
    { label: "Expertise", section: "expertise" },
    { label: "Services", section: "services" },
    { label: "Portfolio", section: "portfolio" },
  ];

  const handleNav = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-foreground/5 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-6 lg:gap-10">
          <button 
            onClick={() => handleNav("home")} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-2.5 h-2.5 bg-accent rounded-full blinker" />
            <h1 className="font-serif text-xl md:text-2xl lg:text-3xl tracking-tight font-bold text-foreground whitespace-nowrap">
              PRUTHVI <span className="font-light italic">CO-ORDINATES</span>
            </h1>
          </button>

          {/* Data Points - Desktop */}
          <div className="hidden lg:flex items-center gap-4 font-mono text-[10px] tracking-widest text-foreground/60 border-l border-foreground/10 pl-6">
            <div className="flex items-center gap-2 group hover:text-accent transition-colors cursor-crosshair">
              <span>LAT</span>
              <span className="text-foreground/80 group-hover:text-accent">21.1702° N</span>
            </div>
            <span className="text-foreground/20">//</span>
            <div className="flex items-center gap-2 group hover:text-accent transition-colors cursor-crosshair">
              <span>LON</span>
              <span className="text-foreground/80 group-hover:text-accent">72.8311° E</span>
            </div>
            <span className="text-foreground/20">//</span>
            <div className="flex items-center gap-2 group hover:text-accent transition-colors cursor-crosshair">
              <span>EST</span>
              <span className="text-foreground/80 group-hover:text-accent">1989</span>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-6 font-sans text-xs font-semibold tracking-widest uppercase text-foreground/70">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNav(item.section)}
                className="hover:text-accent transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => handleNav("contact")}
            className="hidden md:block px-6 py-2.5 bg-foreground text-background font-mono text-xs hover:bg-accent transition-all duration-300 uppercase tracking-widest shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Project
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-foreground/10 animate-fade-in-up">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNav(item.section)}
                className="text-left font-sans text-sm font-semibold tracking-widest uppercase text-foreground/70 hover:text-accent transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("contact")}
              className="mt-4 px-6 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-widest"
            >
              Start Project
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
