import type { Metadata } from "next";
import { Teko, Exo_2 } from "next/font/google";
import "./globals.css";

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
  weight: ["700"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SKIMASTER — Szkoła Narciarska",
  description:
    "Profesjonalna szkoła narciarska SKIMASTER. Indywidualne i grupowe lekcje narciarstwa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${teko.variable} ${exo2.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
