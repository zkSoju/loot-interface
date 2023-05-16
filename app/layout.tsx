"use client";
/* eslint-disable @next/next/no-head-element */

import {
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { NextSeo } from "next-seo";
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import "../styles/globals.css";
import "../styles/tailwind.css";
import Navbar from "./Navbar";

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
      <head>
        <NextSeo
          title="Share Loot"
          description="Share your Loot with your friends and community."
          openGraph={{
            type: "website",
            description: "Share your Loot with your friends and community.",
            title: "Share Loot",
            images: [
              {
                url: "https://i.imgur.com/fvsVHuJ.png",
              },
            ],
          }}
          twitter={{
            cardType: "summary_large_image",
          }}
        />
      </head>
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
