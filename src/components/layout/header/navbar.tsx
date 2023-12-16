"use client";

import { type User } from "lucia";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import UserNav from "../user-nav";
export default function Navbar({ loggedInUser }: { loggedInUser: User }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <nav className="flex h-full items-center justify-between">
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
      <div className="hidden items-center gap-12 md:flex 2xl:gap-16">
        <div className="space-x-4 text-center text-sm leading-loose text-muted-foreground md:text-left">
          <Link
            href="/changelog"
            className="font-semibold hover:underline hover:underline-offset-4"
          >
            Changelog
          </Link>
          <Link
            href="/about"
            className="font-semibold hover:underline hover:underline-offset-4"
          >
            About
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          {loggedInUser ? (
            <UserNav user={loggedInUser} />
          ) : (
            <Link href="/login" className={buttonVariants()}>
              Login
            </Link>
          )}
        </div>
      </div>
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetTrigger className="md:hidden">
          <MenuIcon />
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col items-center space-y-10 py-10">
            <div className="space-y-4 text-center text-sm leading-loose text-muted-foreground">
              <Link
                href="/changelog"
                className="block font-semibold hover:underline hover:underline-offset-4"
                onClick={() => setIsModalOpen(false)}
              >
                Changelog
              </Link>
              <Link
                href="/about"
                className="block font-semibold hover:underline hover:underline-offset-4"
                onClick={() => setIsModalOpen(false)}
              >
                About
              </Link>
            </div>
            <div className="flex items-center gap-x-2">
              {loggedInUser ? (
                <UserNav user={loggedInUser} />
              ) : (
                <Link
                  href="/login"
                  className={buttonVariants()}
                  onClick={() => setIsModalOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
