import SidebarNav from "~/components/layout/sidebar-nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="container ">
      <div className="flex min-h-[calc(100vh-140px)] flex-col gap-8 rounded-md border bg-primary-foreground px-5 py-8 md:min-h-[calc(100vh-160px)] lg:flex-row">
        <aside className="lg:w-1/5">
          <SidebarNav />
        </aside>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
