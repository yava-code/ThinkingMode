import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google"; // proper import
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mechanistic Interpretability",
  description: "Reverse Engineering the Ghost in the Machine",
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} antialiased bg-background text-foreground flex min-h-screen`}
        suppressHydrationWarning
      >
        <Sidebar />
        <main className="flex-1 p-8 relative overflow-y-auto h-screen">
           <div className="absolute top-0 right-0 p-4 font-mono text-xs text-oxblood opacity-50 z-10 pointer-events-none">
              SYSTEM_READY
           </div>
           {children}
        </main>
      </body>
    </html>
  );
}
