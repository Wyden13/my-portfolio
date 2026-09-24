import "./globals.css";
import { minecraftFont, notoSans } from "./ui/fonts";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${minecraftFont.variable} ${notoSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-dvh flex-col bg-[var(--background)] text-[var(--text-primary)]">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          storageKey="theme"
        >
          <Header />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
