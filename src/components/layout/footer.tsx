import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm">
              {siteConfig.description}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
