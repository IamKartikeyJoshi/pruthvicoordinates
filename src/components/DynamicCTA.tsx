import { ArrowRight, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";

interface Props {
  pageKey: string; // 'home', 'mission', 'expertise', 'services', 'portfolio', 'contact', 'book'
  variant?: 'dark' | 'light';
  fallback: {
    eyebrow?: string;
    heading: string;
    headingAccent?: string;
    subheading?: string;
    primaryText: string;
    primaryLink: string;
    secondaryText?: string;
    secondaryLink?: string;
    phone?: string;
    email?: string;
  };
}

/**
 * Single dynamic CTA block per page. Admin edits via Admin > [Page] > CTA Block.
 * Falls back to provided default copy.
 */
export default function DynamicCTA({ pageKey, variant = 'light', fallback }: Props) {
  const { getFirst } = useSiteContent(pageKey);
  const c = getFirst('cta_section')?.content || {};

  const eyebrow = c.eyebrow ?? fallback.eyebrow;
  const heading = c.heading || fallback.heading;
  const headingAccent = c.heading_accent ?? fallback.headingAccent;
  const subheading = c.subheading ?? fallback.subheading;
  const primaryText = c.primary_text || fallback.primaryText;
  const primaryLink = c.primary_link || fallback.primaryLink;
  const secondaryText = c.secondary_text ?? fallback.secondaryText;
  const secondaryLink = c.secondary_link ?? fallback.secondaryLink;
  const phone = c.phone ?? fallback.phone;
  const email = c.email ?? fallback.email;

  const dark = variant === 'dark';

  return (
    <section className={`py-20 md:py-24 relative overflow-hidden ${dark ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}>
      {dark && <div className="absolute inset-0 opacity-5"><div className="grid-pattern h-full" /></div>}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {eyebrow && (
            <h3 className={`font-mono text-xs font-bold tracking-widest mb-4 uppercase ${dark ? 'text-accent' : 'text-foreground/40'}`}>
              {eyebrow}
            </h3>
          )}
          <h2 className={`font-serif text-3xl md:text-5xl lg:text-6xl mb-6 ${dark ? 'text-background' : 'text-foreground'}`}>
            {heading} {headingAccent && <span className={`italic ${dark ? 'text-background/80' : 'text-accent'}`}>{headingAccent}</span>}
          </h2>
          {subheading && (
            <p className={`text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto ${dark ? 'text-background/60' : 'text-foreground/60'}`}>
              {subheading}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
            <Link
              to={primaryLink}
              className={`px-6 md:px-8 py-3 md:py-4 font-mono text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 transition-all duration-300 group ${dark ? 'bg-accent text-white hover:bg-accent/90' : 'bg-foreground text-background hover:bg-accent'}`}
            >
              {primaryText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            {secondaryText && secondaryLink && (
              <Link
                to={secondaryLink}
                className={`px-6 md:px-8 py-3 md:py-4 font-mono text-xs md:text-sm uppercase tracking-widest transition-all duration-300 border ${dark ? 'border-background/30 hover:border-background text-background' : 'border-foreground/20 hover:border-foreground text-foreground'}`}
              >
                {secondaryText}
              </Link>
            )}
          </div>
          {(phone || email) && (
            <div className={`flex flex-wrap justify-center gap-6 md:gap-8 ${dark ? 'text-background/60' : 'text-foreground/60'}`}>
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="font-mono text-sm">{phone}</span>
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="font-mono text-sm">{email}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}