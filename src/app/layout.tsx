import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "RecoverAI",
  description: "AI-powered revenue recovery for Razorpay merchants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <div className="ml-64">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}