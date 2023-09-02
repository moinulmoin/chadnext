import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";
import { buttonVariants } from "../ui/button";

export default function OpenSource() {
  return (
    <section className="container py-8 md:py-12 lg:py-24">
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
          className={cn(buttonVariants(), "h-auto w-auto gap-x-2.5")}
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
        >
          <span>Star on</span>
          <Icons.gitHub width={20} />
        </Link>
      </div>
    </section>
  );
}
