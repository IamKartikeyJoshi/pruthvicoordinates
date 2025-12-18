import Header from "@/components/Header";
import PortfolioSection from "@/components/PortfolioSection";
import Footer from "@/components/Footer";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="pt-24">
        <PortfolioSection />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
