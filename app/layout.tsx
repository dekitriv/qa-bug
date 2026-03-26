import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QA Forms Lab",
  description: "A Vercel-ready QA training app with six intentionally buggy onboarding forms."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

