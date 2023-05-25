import Image from "next/image";
import { siteConfig } from "~/config/site";

export default function Footer() {
  return (
    <footer className="absolute w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
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
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Moinul Moin
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
