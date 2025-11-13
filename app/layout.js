import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChildLayout from "./ChildLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Purse",
  description: "Wallet for all crypto currencies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <ChildLayout>{children}</ChildLayout>
        <SpeedInsights />
      </body>
    </html>
  );
}
