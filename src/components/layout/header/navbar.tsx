import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { type CurrentUser } from "~/types";
import UserNav from "../user-nav";

export default function Navbar({
  loggedInUser,
}: {
  loggedInUser: CurrentUser;
}) {
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
      <div className="flex items-center gap-12 2xl:gap-16">
        <div className="hidden space-x-4 text-center text-sm leading-loose text-muted-foreground md:text-left">
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
        </div>
        <div className="flex items-center gap-x-2">
          {loggedInUser ? (
            <UserNav user={loggedInUser} />
          ) : (
            <Link href="/signin" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
