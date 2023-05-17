"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const [tokenAddress, setTokenAddress] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Navigate to the new route
    router.push(`/claim/${tokenAddress}`);
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <input
        onChange={(e) => setTokenAddress(e.target.value)}
        className="mr-4 h-10 w-96 rounded-lg bg-dark p-4 text-white outline-none"
        type="text"
        value={tokenAddress}
        placeholder="Search the loot address"
      />
    </form>
  );
}
