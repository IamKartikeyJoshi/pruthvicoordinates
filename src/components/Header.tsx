import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getItems, getFirst } = useSiteContent('site');

  const brand = getFirst('brand')?.content || {};
  const headerData = getFirst('header_data')?.content || {};
  const navContent = getItems('nav_item');
  const navItems = (navContent.length > 0 ? navContent : [
    { content: { label: 'Home', link: '/' } },
    { content: { label: 'Mission', link: '/mission' } },
    { content: { label: 'Expertise', link: '/expertise' } },
    { content: { label: 'Services', link: '/services' } },
    { content: { label: 'Portfolio', link: '/portfolio' } },
  ]).map((n: any) => ({ label: n.content.label, path: n.content.link }));

  const nameBold = brand.name_bold || 'PRUTHVI';
  const nameItalic = brand.name_italic || 'CO-ORDINATES';
  const logoUrl = brand.logo_url;
  const ctaText = headerData.cta_text || 'Start Project';
  const ctaLink = headerData.cta_link || '/contact';

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-foreground/5 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link 
            to="/" 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {logoUrl ? (
              <img src={logoUrl} alt={nameBold} className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              <div className="w-2.5 h-2.5 bg-accent rounded-full blinker" />
            )}
            <h1 className="font-serif text-xl md:text-2xl lg:text-3xl tracking-tight font-bold text-foreground whitespace-nowrap">
              {nameBold} <span className="font-light italic">{nameItalic}</span>
            </h1>
          </Link>

          {/* Data Points - Desktop */}
          <div className="hidden lg:flex items-center gap-4 font-mono text-[10px] tracking-widest text-foreground/60 border-l border-foreground/10 pl-3">
            <div className="flex items-center gap-2 group hover:text-accent transition-colors cursor-crosshair">
              <span>{headerData.lat_label || 'LAT'}</span>
              <span className="text-foreground/80 group-hover:text-accent">{headerData.lat_value || '21.1702° N'}</span>
            </div>
            <span className="text-foreground/20">//</span>
            <div className="flex items-center gap-2 group hover:text-accent transition-colors cursor-crosshair">
              <span>{headerData.lon_label || 'LON'}</span>
              <span className="text-foreground/80 group-hover:text-accent">{headerData.lon_value || '72.8311° E'}</span>
            </div>
            <span className="text-foreground/20">//</span>
            <div className="flex items-center gap-2 group hover:text-accent transition-colors cursor-crosshair">
              <span>{headerData.est_label || 'EST'}</span>
              <span className="text-foreground/80 group-hover:text-accent">{headerData.est_value || '1989'}</span>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="flex items-center gap-4 lg:gap-8">
          <nav className="hidden lg:flex gap-4 xl:gap-6 font-sans text-xs font-semibold tracking-widest uppercase text-foreground/70">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to={ctaLink}
            className="hidden lg:block px-4 xl:px-6 py-2.5 bg-foreground text-background font-mono text-xs hover:bg-accent transition-all duration-300 uppercase tracking-widest shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            {ctaText}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-foreground/10 animate-fade-in-up">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className="text-left font-sans text-sm font-semibold tracking-widest uppercase text-foreground/70 hover:text-accent transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav(ctaLink)}
              className="mt-4 px-6 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-widest"
            >
              {ctaText}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
