import { SidebarNav } from "~/components/layout/sidebar-nav";

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="container ">
      <div className="rounded-md border bg-primary-foreground shadow-md">
        <div className="flex min-h-[calc(100vh-140px)] flex-col space-y-8  p-8 md:min-h-[calc(100vh-160px)] md:px-10 md:pb-16 md:pt-10 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
