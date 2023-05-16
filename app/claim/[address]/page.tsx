"use client";

import { ClaimData } from "@/lib/types";
import {
  usePrepareSpoilsOfWarClaim,
  useSpoilsOfWarClaim,
} from "@/src/generated";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Home({ params }: { params: { address: string } }) {
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    if (!address) return;
    fetch(
      `/api/existing/claim?` +
        new URLSearchParams({
          address: params.address,
          user: address ?? "",
        })
    )
      .then((res) => res.json())
      .then((data) => setClaimData(data));
  }, [params.address, address]);

  console.log(claimData);

  const { config: claimConfig } = usePrepareSpoilsOfWarClaim({
    address: params.address as `0x${string}`,
    args: [
      address ?? "0x",
      BigInt(claimData?.index ?? 0),
      BigInt(claimData?.amount ?? 0),
      (claimData?.proof as `0x${string}`[]) ?? ["0x"],
    ],
    enabled: !!claimData && !!address,
  });

  const { write } = useSpoilsOfWarClaim(claimConfig);

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
              <div className="mb-4 h-px w-full bg-black/10"></div>
            </div>
            <div className="flex w-full items-center justify-between rounded-md bg-[#efeff7ff] p-4">
              <p>You have {claimData?.amount} tokens to claim.</p>
              <button
                onClick={() => write?.()}
                className="flex h-12 w-48 items-center justify-center rounded-lg border border-slate-500 bg-dark text-white hover:bg-dark/90"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
