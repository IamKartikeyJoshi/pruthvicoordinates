import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ClientsSection from "@/components/ClientsSection";
import ProcessSection from "@/components/ProcessSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";

const Index = () => {
  const { getItems, getFirst, loading } = useSiteContent('home');

  return (
    <div className="min-h-screen bg-background overflow-x-hidden page-bg">
      <Header />
      <main>
        <HeroSection heroData={getFirst('hero')} />
        <StatsSection items={getItems('stat')} />
        <ClientsSection items={getItems('client')} />
        <ProcessSection items={getItems('process')} />
        <CTASection />
      </main>
      <Footer contactInfo={getFirst('contact_info')?.content} />
    </div>
  );
};

export default Index;
