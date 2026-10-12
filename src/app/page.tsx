import { Faq, FinalCta, Footer, Pricing, Testimonials } from "@/components/closing";
import { Curriculum } from "@/components/curriculum";
import { Faculty } from "@/components/faculty";
import { Hero } from "@/components/hero";
import { LessonPreview } from "@/components/lesson-preview";
import { Manifesto, Marquee } from "@/components/manifesto";
import { Method } from "@/components/method";
import { Nav } from "@/components/nav";
import { Organisations } from "@/components/organisations";
import { Outcomes } from "@/components/outcomes";
import { SavingsJourney } from "@/components/savings-journey";
import { Simulator } from "@/components/simulator";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Outcomes />
        <SavingsJourney />
        <Simulator />
        <Curriculum />
        <LessonPreview />
        <Method />
        <Faculty />
        <Testimonials />
        <Pricing />
        <Organisations />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
