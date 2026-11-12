import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { AuthProvider } from "./providers/useAuthProvider"
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urban Nest",
  description: "An apartment subletting service.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div className="min-h-dvh text-zinc-950">
          <AuthProvider>
            <div className="mx-auto flex min-h-dvh w-full max-w[1100px] flex-col border-x border-zinc-300">
              <Header />
              <main className="px-4 py-8">{children}</main>
            </div>
            <Footer />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
