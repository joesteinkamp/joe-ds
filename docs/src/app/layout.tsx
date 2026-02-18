import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TokenStyles from "@/components/docs/TokenStyles";
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
  title: "js-ds-ui Docs",
  description: "Documentation and live demos for the js-ds-ui design system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" data-density="default">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TokenStyles />
        {children}
      </body>
    </html>
  );
}
