import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "LICTD Systems Hub",
  description: "Lantapan ICT Division Apps and Systems. Centralized dashboard for all LGU digital platforms and internal systems.",
  icons: {
    icon: "/images/ictlogo_icon-white.png",
    shortcut: "/images/ictlogo_icon-white.png",
    apple: "/images/ictlogo_icon-white.png",
  },
  openGraph: {
    title: "LICTD Systems Hub",
    description: "Lantapan ICT Division Apps and Systems. Centralized dashboard for all LGU digital platforms and internal systems.",
    url: "https://hub.lantapan.gov.ph",
    siteName: "LICTD Systems Hub",
    images: [
      {
        url: "/images/social-tag.png",
        width: 1200,
        height: 630,
        alt: "LICTD Systems Hub",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LICTD Systems Hub",
    description: "Lantapan ICT Division Apps and Systems. Centralized dashboard for all LGU digital platforms and internal systems.",
    images: ["/images/social-tag.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased text-ink-100 bg-void`}
      >
        {children}
      </body>
    </html>
  );
}
