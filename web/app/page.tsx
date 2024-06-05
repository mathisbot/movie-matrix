import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="overflow-hidden min-w-screen">
      <Header />
      <Hero />
      <About />
      <FAQ />
      <Footer />
    </div>
  );
}
