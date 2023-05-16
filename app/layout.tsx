/* eslint-disable @next/next/no-head-element */

import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";
import "../styles/tailwind.css";

import type { Metadata } from "next";
import { Wrapper } from "@/components/wrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://shareloot.xyz"),
  title: "Share Loot",
  description: "Share your Loot with the world",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shareloot.xyz",
    title: "Share Loot",
    description: "Share your Loot with the world",
    images: [
      {
        url: "https://i.imgur.com/fvsVHuJ.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
