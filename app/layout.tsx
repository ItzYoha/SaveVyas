import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invisible Addiction Dashboard",
  description: "Track your doomscrolling habits",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030303] text-zinc-100 min-h-screen selection:bg-violet-500/30`}>
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-violet-900/20 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-900/20 blur-[100px]" />
        </div>
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}