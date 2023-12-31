import Footer from "~/components/layout/footer";
import Header from "~/components/layout/header";
import ThemeProvider from "~/components/shared/theme-provider";
import { Toaster } from "~/components/ui/toaster";

export default function SubLayout({
  children,
  loginDialog,
  // params: { locale },
}: {
  children: React.ReactNode;
  loginDialog: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Header />
      <main>
        {/* <I18nProviderClient locale={locale}> */}
        {children}
        {loginDialog}
        {/* </I18nProviderClient> */}
      </main>
      <Footer />
      <Toaster />
    </ThemeProvider>
  );
}
