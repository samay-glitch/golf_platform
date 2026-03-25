import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { headers } from "next/headers";
import { Toaster } from 'sonner'
import { GlobalToast } from '@/components/global-toast'
import { Suspense } from 'react'
import { LoadingBar } from '@/components/layout/loading-bar'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fairway Impact | Golf, Prizes, and Charity",
  description: "Play golf, enter monthly draws to win prizes, and support your favorite charities. The ultimate golf subscription platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || ""; 
  
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-background antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={null}>
                <LoadingBar />
              </Suspense>
              <Navbar />
              <main className="grow flex flex-col">
                {children}
                <Footer />
              </main>
            </div>
            <Toaster richColors position="top-right" />
            <Suspense fallback={null}>
              <GlobalToast />
            </Suspense>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
