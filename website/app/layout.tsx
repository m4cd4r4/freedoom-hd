import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreeDoom HD — AI-Upscaled Texture Pack",
  description:
    "Free 4x AI-upscaled texture pack for Freedoom. 2,500+ textures, sprites, and flats enhanced with Real-ESRGAN. Compatible with GZDoom.",
  openGraph: {
    title: "FreeDoom HD — AI-Upscaled Texture Pack",
    description:
      "Free 4x AI-upscaled texture pack for Freedoom. 2,500+ assets enhanced with Real-ESRGAN.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrains.variable} ${inter.variable} antialiased bg-[#0a0e14] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
