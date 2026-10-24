import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#090d16",
};

export const metadata: Metadata = {
  title: "NexusAgent Studio | Production Autonomous AI & Workflow Engine (FE-11)",
  description:
    "Production-grade autonomous AI orchestrator with real-time token streaming, Generative UI tool execution, rate limiting, and abuse protection.",
  keywords: [
    "AI Agent",
    "Workflow Automation",
    "Next.js 16",
    "Tailwind CSS v4",
    "Frontend AI Engineering",
    "Vercel AI SDK",
    "Production Deployment",
  ],
  authors: [{ name: "Frontend AI Engineering Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
