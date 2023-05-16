"use client";

import { Navbar } from "@/components/Navbar";
import {
  RainbowKitProvider,
  getDefaultWallets,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";

export function Wrapper({ children }: { children: React.ReactNode }) {
  const { chains, publicClient } = configureChains(
    [mainnet],
    [
      alchemyProvider({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "",
      }),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "ShareLoot",
    chains,
  });

  const config = createConfig({
    autoConnect: true,
    publicClient,
    connectors,
  });

  return (
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
  );
}
