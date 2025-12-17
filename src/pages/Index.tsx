import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={scrollToSection} />
      
      <main>
        <HeroSection onNavigate={scrollToSection} />
        <MissionSection />
        <ExpertiseSection />
        <ServicesSection />
        <PortfolioSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
