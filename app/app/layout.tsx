import type { Metadata } from "next";
import { Pangolin, Shadows_Into_Light } from "next/font/google";
import "./globals.css";

const pangolin = Pangolin({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-body",
});
const shadowsIntoLight = Shadows_Into_Light({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "Sell Me This Thing!",
  description:
    "An AI-powered sales game where you convince customers to buy your products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pangolin.variable} ${shadowsIntoLight.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
