import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Factory | Premium Engineering Projects & Custom Software",
  description: "The ultimate production-ready project warehouse and custom MVP incubator. Elevate your final year, research, startup, or professional software development with world-class engineering.",
  keywords: "Web Development, Mobile Apps, Artificial Intelligence, Machine Learning, Deep Learning, AI Agents, Agentic AI, Multi-Agent Systems, Automation, Cybersecurity, Final Year Projects, Research Projects, Startup MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-void text-snow font-sans" suppressHydrationWarning>
        <ToastProvider>
          <ClientWrapper>
            <Navbar />
            <main className="flex-grow pt-20 relative">
              {children}
            </main>
            <Footer />
          </ClientWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
