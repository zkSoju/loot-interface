"use client";

import { ClaimData } from "@/lib/types";
import {
  useErc20Symbol,
  useLootClaim,
  useLootToken,
  usePrepareLootClaim,
} from "@/src/generated";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Home({ params }: { params: { address: string } }) {
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const { address } = useAccount();

  const { data: tokenData } = useLootToken({
    address: params.address as `0x${string}`,
  });

  const { data: symbolData } = useErc20Symbol({
    address: tokenData ?? "0x",
    enabled: !!tokenData,
  });

  console.log(symbolData);

  useEffect(() => {
    if (!address) return;

    try {
      fetch(
        `/api/existing/claim?` +
          new URLSearchParams({
            address: params.address,
            user: address ?? "",
          })
      )
        .then((res) => res.json())
        .then((data) => setClaimData(data));
    } catch (e) {
      console.log(e);
    }
  }, [params.address, address]);

  console.log(claimData);

  const { config: claimConfig } = usePrepareLootClaim({
    address: params.address as `0x${string}`,
    args: [
      address ?? "0x",
      BigInt(claimData?.index ?? 0),
      BigInt(claimData?.amount ?? 0),
      (claimData?.proof as `0x${string}`[]) ?? ["0x"],
    ],
    enabled: !!claimData && !!address,
  });

  const { write } = useLootClaim(claimConfig);

  return (
    <div>
      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        <div className="shadow-me relative flex w-[42rem] flex-col items-start overflow-hidden rounded-lg bg-dark p-2">
          <div className="relative flex h-full w-full flex-col justify-between p-4">
            <div className="relative flex w-full items-center justify-between rounded-md border border-white/10 p-4 py-8">
              <div className="absolute left-0 top-0 h-full w-full overflow-hidden rounded-md gradient-mask-l-0">
                <Image src="/coins.png" fill className="object-cover" alt="" />
              </div>

              {tokenData &&
              tokenData !== "0x0000000000000000000000000000000000000000" ? (
                <>
                  <p className="relative">
                    You have ${claimData?.amount} ${symbolData ?? "tokens"} to
                    claim.
                  </p>
                  <button
                    onClick={() => write?.()}
                    className="relative flex h-12 w-48 items-center justify-center rounded-lg bg-sage text-dark hover:bg-sage/90"
                  >
                    Claim
                  </button>
                </>
              ) : (
                <p className="relative">Loot not initialized.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
