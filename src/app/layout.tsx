import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VAGABOND // Cultural Discovery & Digital Atlas",
  description: "An immersive, non-commercial digital atlas and storytelling platform exploring local cultures, soundscapes, and hidden paths around the world.",
  keywords: ["travel storytelling", "cultural atlas", "digital magazine", "explore cultures", "Japan Alps", "Sahara Desert", "ambient soundscapes"],
  authors: [{ name: "Vagabond Discovery Team" }],
  openGraph: {
    title: "VAGABOND // Cultural Discovery & Digital Atlas",
    description: "An immersive, non-commercial digital atlas and storytelling platform exploring local cultures, soundscapes, and hidden paths around the world.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050507] text-[#f8fafc] overflow-x-hidden selection:bg-rose-500/30 selection:text-rose-200">
        {children}
      </body>
    </html>
  );
}
