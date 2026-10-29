import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { profile } from "@/lib/profile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${profile.name} · Portfolio`,
  description: profile.pitch,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
    >
      <body className="min-h-screen">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
