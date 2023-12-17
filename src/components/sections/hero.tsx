import { StarIcon } from "lucide-react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { BrandIcons } from "~/components/shared/brand-icons";
import Icons from "~/components/shared/icons";
import { buttonVariants } from "~/components/ui/button";
import { nFormatter } from "~/lib/utils";

export default async function Hero() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/moinulmoin/chadnext",
    {
      next: { revalidate: 60 },
    }
  )
    .then((res) => res.json())
    .catch((e) => console.error(e));
  return (
    <section>
      <div className="container flex h-full min-h-[calc(100vh-140px)] w-full flex-col items-center justify-center space-y-20 py-14 md:min-h-[calc(100vh-160px)] xl:py-24">
        <div className="mx-auto w-full max-w-2xl ">
          <a
            href="https://twitter.com/immoinulmoin/status/1661645764697919489"
            title="Follow Updates"
            target="_blank"
            rel="noreferrer"
            className="mx-auto mb-5 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors duration-300 hover:bg-blue-200"
          >
            <Icons.twitter className="h-5 w-5 text-blue-700" />
            <p className="text-sm font-semibold text-blue-700">
              Introducing ChadNext
            </p>
          </a>
          <h1 className=" bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text text-center font-heading text-[40px] font-bold leading-tight tracking-[-0.02em] text-transparent drop-shadow-sm duration-300 ease-linear animate-in zoom-in-75 dark:bg-gradient-to-br dark:from-gray-100 dark:to-gray-900 md:text-7xl md:leading-[5rem]">
            <Balancer>Quick Starter Template for your Next.js project</Balancer>
          </h1>
          <p className="mt-6 text-center text-muted-foreground md:text-xl">
            <Balancer>
              Packed with all necessary features to get started.
            </Balancer>
          </p>
          <div className="mx-auto mt-6 flex items-center justify-center space-x-5">
            <Link className={buttonVariants() + " gap-x-2"} href="/login">
              Get Started
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" }) + " gap-x-2"}
              href="https://github.com/moinulmoin/chadnext"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-medium">{nFormatter(stars)}</span>
              <StarIcon width={16} />
              <span>on</span>
              <Icons.gitHub width={16} />
            </Link>
          </div>
        </div>
        <div className="w-full ">
          <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight transition-colors">
            Built using Great Tools
          </h2>
          <div className="flex w-full flex-wrap items-center justify-center gap-x-20 gap-y-10 ">
            {tools.map((t, i) => (
              <Link key={i} href={t.link} target="_blank">
                <t.icon />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const tools = [
  {
    link: "https://www.typescriptlang.org/",
    icon: BrandIcons.ts,
  },
  {
    link: "https://nextjs.org/",
    icon: BrandIcons.nextjs,
  },
  {
    link: "https://tailwindcss.com/",
    icon: BrandIcons.tailwind,
  },
  {
    link: "https://www.prisma.io/",
    icon: BrandIcons.prisma,
  },
  {
    link: "https://vercel.com/",
    icon: BrandIcons.vercel,
  },
];
