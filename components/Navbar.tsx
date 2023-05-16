"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const [tokenAddress, setTokenAddress] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Navigate to the new route
    router.push(`/claim/${tokenAddress}`);
  };

  return (
    <div className="fixed z-50 flex w-full items-center justify-center">
      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full items-center justify-between border-b border-white/5 px-24 py-4"
      >
        <div className="flex items-center">
          <p className="mr-4">
            Share<span className="text-sage">Loot</span>
          </p>
          <input
            onChange={(e) => setTokenAddress(e.target.value)}
            className="mr-4 h-10 w-96 rounded-lg bg-dark p-4 text-white outline-none"
            type="text"
            value={tokenAddress}
            placeholder="Search the loot address"
          />
        </div>
        <div className="flex shrink-0 items-center">
          <ConnectButton />
        </div>
      </form>
    </div>
  );
}
