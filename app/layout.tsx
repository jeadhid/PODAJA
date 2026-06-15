import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PODAJA — Prediksi dan Observasi Data Air Jakarta",
  description:
    "Dashboard akademik visualisasi estimasi spasial data PM10 DKI Jakarta menggunakan model ML HBSTM, LSTM, dan XGBoost.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        {/* Sticky top navbar */}
        <Navbar />
        {/* Page content wrapper */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 flex flex-col gap-6">
          {children}
        </main>
      </body>
    </html>
  );
}
