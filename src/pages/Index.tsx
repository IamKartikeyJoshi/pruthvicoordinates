import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ClientsSection from "@/components/ClientsSection";
import ProcessSection from "@/components/ProcessSection";
import DynamicCTA from "@/components/DynamicCTA";
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
        <DynamicCTA pageKey="home" variant="dark" fallback={{ eyebrow: 'Ready to Get Started?', heading: "Let's Map Your", headingAccent: 'Success', subheading: "Whether it's a small residential plot or a large infrastructure project, our team delivers precision surveying you can trust.", primaryText: 'Request a Quote', primaryLink: '/contact', secondaryText: 'Book Consultation', secondaryLink: '/book-appointment', phone: '+91 98765 43210', email: 'pruthvinay@gmail.com' }} />
      </main>
      <Footer contactInfo={getFirst('contact_info')?.content} />
    </div>
  );
};

export default Index;
