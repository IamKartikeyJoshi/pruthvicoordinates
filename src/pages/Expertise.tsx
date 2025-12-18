import Header from "@/components/Header";
import ExpertiseSection from "@/components/ExpertiseSection";
import Footer from "@/components/Footer";

const Expertise = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="pt-24">
        <ExpertiseSection />
      </main>
      <Footer />
    </div>
  );
};

export default Expertise;
