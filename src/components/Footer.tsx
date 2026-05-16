import { Link } from "react-router-dom";
import { Linkedin, Instagram, Twitter } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface Props {
  contactInfo?: Record<string, any>;
}

const Footer = ({ contactInfo }: Props) => {
  const phone = contactInfo?.phone || '+91 98765 43210';
  const email = contactInfo?.email || 'info@pruthvisurvey.com';
  const { getItems, getFirst } = useSiteContent('site');
  const brand = getFirst('brand')?.content || {};
  const main = getFirst('footer_main')?.content || {};
  const quickLinks = getItems('footer_quick_link');
  const services = getItems('footer_service');

  const nameBold = brand.name_bold || 'PRUTHVI';
  const nameItalic = brand.name_italic || 'CO-ORDINATES';
  const logoUrl = brand.logo_url;
  const tagline = main.tagline || 'Defining the future, one coordinate at a time. Trusted by government bodies and private developers since 1989.';
  const copyright = (main.copyright || '© {year} Pruthvi Co-ordinates. All rights reserved.').replace('{year}', String(new Date().getFullYear()));
  const signOff = main.sign_off || 'Designed with precision.';
  const linkedinUrl = main.linkedin_url || '#';
  const instagramUrl = main.instagram_url || '#';
  const twitterUrl = main.twitter_url || '#';
  const quickHeading = main.quick_links_heading || 'Quick Links';
  const servicesHeading = main.services_heading || 'Services';
  const connectHeading = main.connect_heading || 'Connect';

  const fallbackQuick = [
    { label: 'Home', link: '/' }, { label: 'Mission', link: '/mission' }, { label: 'Expertise', link: '/expertise' },
    { label: 'Services', link: '/services' }, { label: 'Portfolio', link: '/portfolio' }, { label: 'Contact', link: '/contact' }
  ];
  const quickItems = (quickLinks.length > 0 ? quickLinks.map(i => i.content) : fallbackQuick);
  const fallbackServices = [
    { label: 'Topographical Survey' }, { label: 'Boundary Demarcation' }, { label: 'DGPS Control Survey' },
    { label: 'Drone Aerial Survey' }, { label: 'As-Built Documentation' }
  ];
  const serviceItems = (services.length > 0 ? services.map(i => i.content) : fallbackServices);

  return (
    <footer className="bg-foreground text-background py-16 border-t border-background/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt={nameBold} className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-2.5 h-2.5 bg-accent rounded-full blinker" />
              )}
              <h4 className="font-serif text-2xl">{nameBold} <span className="italic font-light">{nameItalic}</span></h4>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed">{tagline}</p>
          </div>

          <div>
            <h5 className="font-mono text-xs font-bold tracking-widest text-accent mb-6 uppercase">{quickHeading}</h5>
            <ul className="space-y-3 text-sm text-background/60">
              {quickItems.map((q: any, idx: number) => (
                <li key={idx}><Link to={q.link || '/'} className="hover:text-background transition-colors">{q.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs font-bold tracking-widest text-accent mb-6 uppercase">{servicesHeading}</h5>
            <ul className="space-y-3 text-sm text-background/60">
              {serviceItems.map((s: any, idx: number) => (
                <li key={idx} className="hover:text-background cursor-pointer transition-colors">{s.label}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs font-bold tracking-widest text-accent mb-6 uppercase">{connectHeading}</h5>
            <div className="flex gap-4 mb-6">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            <div className="text-sm text-background/60">
              <p>{email}</p>
              <p>{phone}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-background/40 gap-4">
          <p>{copyright}</p>
          <div className="flex gap-6">
            <span className="hover:text-background cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-background cursor-pointer transition-colors">Terms of Service</span>
          </div>
          <p>{signOff}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
