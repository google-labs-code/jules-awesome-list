import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Roboto_Mono, Inter, Unbounded } from "next/font/google"; // Added Inter, Unbounded
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import RoamingAlien from "@/components/RoamingAlien";

import NavBar from "@/components/NavBar";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hack Rust Course",
  description: "Learn Rust the fun way with interactive lessons.",
};

import { CourseProvider } from "@/lib/context/course-context";
import GSAPRegistry from "@/components/GSAPRegistry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robotoMono.variable} ${inter.variable} ${unbounded.variable} antialiased`} suppressHydrationWarning>
        <CourseProvider>
          <GSAPRegistry />
          <CustomCursor />
          <NavBar />
          <RoamingAlien />
          {children}
          <SpeedInsights />
        </CourseProvider>
      </body>
    </html>
  );
}
