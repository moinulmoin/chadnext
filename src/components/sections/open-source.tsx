import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { siteConfig } from "~/config/site";

export default function OpenSource() {
  return (
    <section className="bg-secondary">
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Proudly Open Source
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            <Balancer>
              ChadNext is open source and powered by open source software. The
              code is available on GitHub.
            </Balancer>
          </p>
          <Link
            className="underline underline-offset-4"
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
          >
            <span className="font-semibold">Star me</span>, Onii Chan {`>_<`}
          </Link>
        </div>
      </div>
    </section>
  );
}
