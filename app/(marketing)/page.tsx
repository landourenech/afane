import About from "@/components/marketing/about";
import FAQSection from "@/components/marketing/faq";
import Hero from "@/components/marketing/hero";
import Newsletter from "@/components/marketing/newsletter";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <FAQSection />
      <Newsletter />
    </div>
  );
}
