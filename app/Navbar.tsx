"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Navigate to the new route
    router.push(`/claim/${tokenAddress}`);
  };

  return (
    <div className="fixed z-50 w-full px-24">
      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full items-center justify-center border-b border-white/5 px-8 py-4"
      >
        <input
          onChange={(e) => setTokenAddress(e.target.value)}
          className="mr-4 h-10 w-96 rounded-lg bg-white p-4"
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
};

export default Navbar;
