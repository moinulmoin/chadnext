import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "~/config/site";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full py-4 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Image
            src="/chad-next.png"
            alt="ChadNext logo"
            width="24"
            height="24"
            className="hidden h-6 w-6 rounded-sm object-contain md:inline-block"
          />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Developed by{" "}
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Moinul Moin
            </Link>
          </p>
        </div>
        <p className="space-x-4 text-center text-sm leading-loose text-muted-foreground md:text-left">
          <Link
            href="/about"
            className="font-semibold hover:underline hover:underline-offset-4"
          >
            About
          </Link>
          <Link
            href="/changelog"
            className="font-semibold hover:underline hover:underline-offset-4"
          >
            Changelog
          </Link>
        </p>
      </div>
    </footer>
  );
}
