import Features from "~/components/sections/features";
import Hero from "~/components/sections/hero";
import OpenSource from "~/components/sections/open-source";

export default async function Home() {
  return (
    <>
      <Hero />
      <Features />
      <OpenSource />
    </>
  );
}
