import { Navbar } from "../../app/components/Navbar";
import { Hero } from "../../app/components/Hero";
import { Features } from "../../app/components/Features";
import { HowItWorks } from "../../app/components/HowItWorks";
import { WhyChoose } from "../../app/components/WhyChoose";
import { CTA } from "../../app/components/CTA";
import { Footer } from "../../app/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <WhyChoose />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
