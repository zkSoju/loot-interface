import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

export function Navbar() {
  return (
    <div className="fixed z-50 flex w-full items-center justify-center">
      <div className="flex w-full items-center justify-between border-b border-white/5 px-24 py-4">
        <div className="flex items-center">
          <Link href="/">
            <p className="mr-4 cursor-pointer">
              Share<span className="text-sage">Loot</span>
            </p>
          </Link>
          <SearchBar />
        </div>
        <div className="flex shrink-0 items-center">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
