import Header from "@/components/Header";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

const Services = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="pt-24">
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
