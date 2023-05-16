"use client";

import { LootData } from "@/lib/types";
import {
  useClonesClone,
  useErc20Approve,
  useLootInitialize,
  usePrepareClonesClone,
  usePrepareErc20Approve,
  usePrepareLootInitialize,
} from "@/src/generated";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import { useWaitForTransaction } from "wagmi";

export default function Home() {
  const [data, setData] = useState<LootData | null>(null);
  const [root, setRoot] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

  const CLONES_ADDRESS = "0x33b475480e9e426d974e914bac2250be9273459c";
  const SPOILS_ADDRESS = "0xBb0aeb9C90b2Ef36d36C318962f11aC78C24a457";

  const handleInitialize = async (address: string) => {
    setIsLoading(true);

    const fileInput = document.getElementById("fileInput") as HTMLInputElement;

    const file = fileInput.files?.[0];
    const reader = new FileReader();

    reader.onload = async (event: any) => {
      const fileContent = event.target.result;

      // Now, you can send fileContent to your API route
      const response = await fetch(
        "/api/existing?" +
          new URLSearchParams({
            amount: amount.toString(),
            address: address,
          }),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileContent }),
        }
      );

      const data = await response.json();
      setRoot(data.root);

      // Do something with the response data
      setIsLoading(false);
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);

    const fileInput = document.getElementById("fileInput") as HTMLInputElement;

    const file = fileInput.files?.[0];
    const reader = new FileReader();

    reader.onload = async (event: any) => {
      const fileContent = event.target.result;

      // Now, you can send fileContent to your API route
      const response = await fetch(
        "/api/create?" +
          new URLSearchParams({
            amount: amount.toString(),
          }),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileContent }),
        }
      );

      const data = await response.json();
      setData(data);

      // Do something with the response data
      setIsLoading(false);
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const [selectedAction, setSelectedAction] = useState<string>();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectAction = (action: string) => {
    setSelectedAction(action);
  };

  const handleChange = (
    e: any,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // Check if the input is a number
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex
    if (e.target.value === "" || re.test(e.target.value)) {
      setter(e.target.value);
    }
  };

  const { data: cloneData, config: cloneConfig } = usePrepareClonesClone({
    address: CLONES_ADDRESS,
    args: [SPOILS_ADDRESS],
  });

  const { writeAsync: clone, data: cloneTxData } = useClonesClone(cloneConfig);

  const { isSuccess } = useWaitForTransaction({
    hash: cloneTxData?.hash as `0x${string}`,
    enabled: !!cloneTxData?.hash,
  });

  const { config: initConfig } = usePrepareLootInitialize({
    address: cloneData?.result as `0x${string}`,
    args: [
      tokenAddress as `0x${string}`,
      (root as `0x${string}`) ?? "0x",
      BigInt(amount),
    ],
    enabled: !!root && !!cloneData?.result && !!tokenAddress && !!amount,
  });

  const { write: init } = useLootInitialize(initConfig);

  const { config: approveConfig } = usePrepareErc20Approve({
    address: tokenAddress as `0x${string}`,
    args: [cloneData?.result as `0x${string}`, BigInt(amount)],
    enabled: !!cloneData?.result && !!tokenAddress && !!amount,
  });

  const { writeAsync: approve, data: approveData } =
    useErc20Approve(approveConfig);

  const { isSuccess: isApproveSuccess } = useWaitForTransaction({
    hash: approveData?.hash as `0x${string}`,
  });

  const handleCloneAndInit = async () => {
    await clone?.();
    await approve?.();

    await handleInitialize(cloneData?.result as `0x${string}`);
  };

  useEffect(() => {
    if (isSuccess && isApproveSuccess) {
      init?.();
    }
  }, [init, isSuccess, root, isApproveSuccess]);

  return (
    <div>
      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        <div className="shadow-me relative flex w-[42rem] flex-col items-start rounded-lg bg-dark p-2">
          <div className="radial pointer-events-none absolute h-full w-full rounded-lg"></div>
          <div className="flex h-full w-full flex-col justify-between p-4">
            <div className="flex flex-col">
              <div className="mb-4 flex items-center">
                <div className="shadow-me relative mr-4 h-16 w-16 rounded-md bg-dark p-1">
                  <div className="relative h-full w-full overflow-hidden rounded-md">
                    <Image
                      src="/coins.png"
                      fill
                      className="object-cover"
                      alt=""
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-medium">Loot</p>
                  <p className="text-sm text-white/80">
                    Distribute tokens to your community and more
                  </p>
                </div>
              </div>
              <div className="mb-8 h-px w-full bg-white/10"></div>
            </div>
            <div className="flex flex-col">
              {!isConfirmed && (
                <>
                  <p className="mb-2 font-medium">Actions</p>
                  <div className="relative mb-2 flex h-72 w-full">
                    <div
                      className={`shadow-me relative mr-4 flex h-full w-full cursor-pointer flex-col justify-end overflow-hidden rounded-md border border-white/10 bg-dark p-4 ${
                        selectedAction === "existing" &&
                        "outline outline-offset-1 outline-sage"
                      }`}
                      onClick={() => selectAction("existing")}
                    >
                      <div className="absolute left-0 top-0 h-56 w-full">
                        <Image
                          src="/dragon.png"
                          fill
                          alt=""
                          className="object-cover gradient-mask-b-0"
                        />
                      </div>
                      <div className="relative flex flex-col">
                        <div className="mb-1 flex items-center">
                          <p className="mr-2 font-medium text-white">
                            Starter project
                          </p>
                          <p className="rounded-md border border-sage px-2 py-1 text-xs text-sage">
                            RECCOMENDED
                          </p>
                        </div>
                        <p className="text-xs text-white/80">
                          Deploy your own rewards contract using an existing
                          token in a few clicks.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`shadow-me relative flex h-full w-full cursor-pointer flex-col justify-end overflow-hidden rounded-md border border-white/10 bg-dark p-4 ${
                        selectedAction === "create" &&
                        "outline outline-offset-1 outline-sage"
                      }`}
                      onClick={() => selectAction("create")}
                    >
                      <div className="absolute left-0 top-0 h-56 w-full">
                        <Image
                          src="/city.png"
                          fill
                          alt=""
                          className="object-cover gradient-mask-b-0"
                        />
                      </div>
                      <p className="mb-1 font-medium">Manual installation</p>
                      <p className="text-xs text-white/80">
                        Generate a merkle tree without deploying a contract and
                        serve it yourself.
                      </p>
                    </div>
                  </div>
                </>
              )}
              {!isConfirmed ? (
                <button
                  onClick={() => setIsConfirmed(true)}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-sage text-dark hover:bg-sage/90"
                >
                  Confirm
                </button>
              ) : (
                <>
                  {selectedAction === "create" ? (
                    <>
                      <p className="mb-2 font-medium">Amount to distribute</p>
                      <input
                        onChange={(e) => handleChange(e, setAmount)}
                        className="mb-4 h-12 w-full rounded-lg border border-white/10 bg-dark p-4 text-white outline-none"
                        type="text"
                        value={amount}
                        placeholder="Enter the amount of tokens to distribute"
                      />
                      <p className="mb-2 font-medium">
                        Whitelist file{" "}
                        <span className="opacity-80">(.txt)</span>
                      </p>
                      <input
                        type="file"
                        accept=".txt"
                        id="fileInput"
                        className="mb-4 w-full rounded-md border border-white/10 bg-dark p-4 text-sm font-medium leading-4 text-white"
                      />
                      <button
                        onClick={handleUpload}
                        className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-sage text-white hover:bg-sage/90"
                      >
                        {isLoading ? (
                          <ClipLoader size={20} color="black" />
                        ) : (
                          <div className="flex items-center">
                            <p className="text-dark">Generate</p>
                            <BsStars className="ml-2 text-dark" />
                          </div>
                        )}
                      </button>
                      {data && (
                        <button
                          onClick={downloadJson}
                          className="mt-4 flex h-12 w-full items-center justify-center rounded-lg border border-sky-500 bg-sky-400 text-white hover:bg-sky-500"
                        >
                          Download JSON
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="mb-2 font-medium">Token address</p>
                      <input
                        onChange={(e) => setTokenAddress(e.target.value)}
                        className="mb-4 h-12 w-full rounded-lg border border-white/10 bg-dark p-4 text-white outline-none"
                        type="text"
                        value={tokenAddress}
                        placeholder="Enter the token address"
                      />
                      <p className="mb-2 font-medium">Amount to distribute</p>
                      <input
                        onChange={(e) => handleChange(e, setAmount)}
                        className="mb-4 h-12 w-full rounded-lg border border-white/10 bg-dark p-4 text-white outline-none"
                        type="text"
                        value={amount}
                        placeholder="Enter the amount of tokens to distribute"
                      />
                      <p className="mb-2 font-medium">
                        Whitelist file{" "}
                        <span className="opacity-50">(.txt)</span>
                      </p>
                      <input
                        type="file"
                        accept=".txt"
                        id="fileInput"
                        className="mb-4 w-full rounded-md border border-white/10 bg-dark p-4 text-sm font-medium leading-4 text-white focus:outline-none"
                      />
                      <button
                        onClick={handleCloneAndInit}
                        className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-sage text-dark hover:bg-sage/90"
                      >
                        {isLoading ? (
                          <ClipLoader size={20} color="black" />
                        ) : (
                          <div className="flex items-center">
                            <p className="text-dark">Create</p>
                            <BsStars className="ml-2 text-dark" />
                          </div>
                        )}
                      </button>
                      {data && (
                        <button
                          onClick={downloadJson}
                          className="mt-4 flex h-12 w-full items-center justify-center rounded-lg border border-slate-500 bg-dark text-white hover:bg-dark/90"
                        >
                          Download JSON
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
