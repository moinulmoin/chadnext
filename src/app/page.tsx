import Features from "~/components/sections/features";
import Hero from "~/components/sections/hero";
import OpenSource from "~/components/sections/open-source";
import Pricing from "~/components/sections/pricing";

export default async function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <OpenSource />
    </>
  );
}
