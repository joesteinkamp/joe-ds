import type { Metadata } from "next";
import TokenStyles from "@/components/docs/TokenStyles";
import "./globals.css";

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
      <body>
        <TokenStyles />
        {children}
      </body>
    </html>
  );
}
