import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookmark Manager | Preetham M",
  description:
    "A secure multi-user bookmark manager built with Next.js and Supabase.",
  openGraph: {
    title: "Bookmark Manager | Preetham M",
    description:
      "Secure multi-user bookmark manager built with Next.js and Supabase.",
    url: "https://your-deployed-url.vercel.app", // 🔥 Replace after deployment
    siteName: "Bookmark Manager",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
