"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";

const navItems = [
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: Icons.projectPlus,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: Icons.billing,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Icons.settings,
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export default function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <nav
      className={cn("flex gap-x-2 lg:flex-col lg:gap-y-1.5", className)}
      {...props}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            isActive(item.href)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {<item.icon className="mr-2 h-4 w-4 " />} {item.title}
        </Link>
      ))}
    </nav>
  );
}
