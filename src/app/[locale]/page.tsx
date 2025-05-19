import FAQ from "~/components/sections/faq";
import Features from "~/components/sections/features";
import Hero from "~/components/sections/hero";
import OpenSource from "~/components/sections/open-source";
import Pricing from "~/components/sections/pricing";
import Testimonials from "~/components/sections/testimonials";

export default async function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <OpenSource />
    </>
  );
}
