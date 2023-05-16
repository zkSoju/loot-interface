"use client";
/* eslint-disable @next/next/no-head-element */

import {
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import "../styles/globals.css";
import "../styles/tailwind.css";
import Navbar from "./Navbar";

import type { Metadata } from "next";

export const config: Metadata = {
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
  const { chains, publicClient } = configureChains(
    [mainnet],
    [
      alchemyProvider({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "",
      }),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "Loot",
    chains,
  });

  const config = createConfig({
    autoConnect: true,
    publicClient,
    connectors,
  });

  return (
    <html>
      <head></head>
      <body>
        <WagmiConfig config={config}>
          <RainbowKitProvider
            chains={chains}
            theme={midnightTheme({
              accentColor: "#45ff79",
              accentColorForeground: "black",
            })}
          >
            <div className="mx-auto">
              <Navbar />
              {children}
            </div>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
