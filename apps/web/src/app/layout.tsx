import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-noto-sans" });
const notoSerif = Noto_Serif({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-serif" });

export const metadata: Metadata = {
  title: "ICMR Clinical Guidelines Portal",
  description: "Indian Council of Medical Research Clinical Guidelines Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${notoSerif.variable} font-sans bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
