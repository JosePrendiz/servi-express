import { Geist, Geist_Mono } from "next/font/google";
import { ThirdwebProvider } from "thirdweb/react";
import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from "./context";
import type { Metadata } from "next";
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
  title: "Servi Express",
  description: "Made By: MrPoshoFrito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <ThirdwebProvider>
            <Header />
            <ToastContainer />
            {children}
            <Footer />
          </ThirdwebProvider>
        </AppProvider>
      </body>
    </html>
  );
}
