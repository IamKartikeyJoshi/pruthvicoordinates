import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="pt-24">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
