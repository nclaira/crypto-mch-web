// =============================================================
// Root Layout — wraps every page in the app
// =============================================================
// This file runs on EVERY page. Think of it as the "frame"
// that surrounds all your pages. It does 3 things:
//   1. Loads the global fonts (Geist)
//   2. Wraps everything with CryptoAuthProvider so every page
//      and component can access the logged-in user via useCryptoAuth()
//   3. Renders the Navbar at the top of every page
// =============================================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CryptoAuthProvider } from "@/lib/auth"; // Global auth context
import Navbar from "@/components/Navbar";         // Top navigation bar

// Load Geist fonts and expose them as CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Browser tab title and description
export const metadata: Metadata = {
  title: "Mucamanza Crypto Hub",
  description: "Premium crypto books and resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0d1117] text-gray-100">
        {/*
          CryptoAuthProvider — makes the logged-in user available
          to every page and component below it via useCryptoAuth()
        */}
        <CryptoAuthProvider>
          {/* Navbar appears at the top of every page */}
          <Navbar />

          {/* Each page's content renders here */}
          <main className="flex flex-1 flex-col">
            {children}
          </main>
        </CryptoAuthProvider>
      </body>
    </html>
  );
}
