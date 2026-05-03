import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/ui/topbar";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COGS Calculator",
  description: "Industrial Resource Management Module",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-[#f8f6f6] text-slate-900 font-sans">
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
