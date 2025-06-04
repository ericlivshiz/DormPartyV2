import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'animate.css';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dorm Party",
  description: "Dorm Party",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full py-10 h-full items-center justify-center text-center space-y-10 font-medium text-lg bg-neutral-900 text-neutral-100 min-h-screen bg-[url(https://www.reactemojis.com/assets/bg-overlay-3.png)] bg-cover bg-center overflow-hidden`}>
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
