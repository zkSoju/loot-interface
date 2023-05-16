"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [tokenAddress, setTokenAddress] = useState("");

  return (
    <div>
      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        <div className="shadow-me relative flex w-[42rem] flex-col items-start rounded-lg bg-white p-2">
          <div className="radial pointer-events-none absolute h-full w-full rounded-lg"></div>
          <div className="flex h-full w-full flex-col justify-between p-4">
            <div className="flex flex-col">
              <div className="mb-4 flex items-center">
                <div className="shadow-me relative mr-4 h-16 w-16 rounded-md bg-white p-1">
                  <div className="relative h-full w-full overflow-hidden rounded-md">
                    <Image
                      src="/coin.png"
                      fill
                      className="object-cover"
                      alt=""
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-medium">Loot</p>
                  <p className="text-sm text-dark/80">
                    Distribute tokens to your community and more
                  </p>
                </div>
              </div>
              <div className="mb-8 h-px w-full bg-black/10"></div>
            </div>
            <input
              onChange={(e) => setTokenAddress(e.target.value)}
              className="mb-4 h-12 w-full rounded-lg bg-[#efeff7ff] p-4"
              type="text"
              value={tokenAddress}
              placeholder="Search the loot address"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
