import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="text-xl font-bold tracking-tight">ChadNext</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">
          Build your SaaS faster
        </h1>
        <p className="max-w-lg text-center text-lg text-muted-foreground">
          Next.js 16, Convex, shadcn/ui, and everything you need to ship.
        </p>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </main>

      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        ChadNext v2
      </footer>
    </div>
  );
}
