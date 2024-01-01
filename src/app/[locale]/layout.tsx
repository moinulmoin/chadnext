import Footer from "~/components/layout/footer";
import Header from "~/components/layout/header";
import ThemeProvider from "~/components/shared/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import { I18nProviderClient } from "~/locales/client";

export default function SubLayout({
  children,
  loginDialog,
  params: { locale },
}: {
  children: React.ReactNode;
  loginDialog: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Header />
      <main>
        {children}
        {loginDialog}
      </main>
      <I18nProviderClient locale={locale}>
        <Footer />
      </I18nProviderClient>
      <Toaster />
    </ThemeProvider>
  );
}
