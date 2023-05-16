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
    <div className="fixed z-50 flex w-full justify-center">
      <form
        onSubmit={handleSearchSubmit}
        className="flex w-[42rem] items-center justify-center border-b border-white/5 py-4"
      >
        <input
          onChange={(e) => setTokenAddress(e.target.value)}
          className="mr-4 h-10 w-full rounded-lg bg-dark p-4 text-white outline-none"
          type="text"
          value={tokenAddress}
          placeholder="Search the loot address"
        />
        <div className="flex shrink-0 items-center">
          <ConnectButton />
        </div>
      </form>
    </div>
  );
}
