import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/shared/ToastContainer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TestFlow - AI-Powered Testing Tool",
  description: "Web-based checklist testing tool with AI-assisted test generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <div className="bg-background ambient-grid relative min-h-screen">
              <div
                aria-hidden="true"
                className="ambient-glow fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
              />
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
