"use client";

import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import useScroll from "~/lib/hooks/use-scroll";
import { cn } from "~/lib/utils";
import ThemeToggle from "../../shared/theme-toggle";
import SignInModal from "../signin-modal";
import UserNav from "../user-nav";

export default function Navbar({ session }: { session: Session | null }) {
  const scrolled = useScroll(50);
  return (
    <header
      className={cn(
        "fixed top-0 w-full",
        scrolled
          ? "h-16 border-b border-gray-200 bg-transparent backdrop-blur-xl transition-all"
          : "h-20 bg-white/0",
        "z-30"
      )}
    >
      <div className="container h-full">
        <div className="flex h-full  items-center justify-between">
          <Link href="/" className="flex items-center text-2xl font-bold">
            <Image
              src="/chad-next.png"
              alt="ChadNext logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm object-contain"
            />
            <p>ChadNext</p>
          </Link>
          <div className=" flex items-center gap-x-2">
            <ThemeToggle />
            {session ? <UserNav session={session} /> : <SignInModal />}
          </div>
        </div>
      </div>
    </header>
  );
}
