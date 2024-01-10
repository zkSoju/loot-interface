"use client";

import {
  useClonesClone,
  useErc20Approve,
  useLootInitialize,
  usePrepareClonesClone,
  usePrepareErc20Approve,
  usePrepareLootInitialize,
} from "@/src/generated";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsStars } from "react-icons/bs";
import { FaCheck, FaRegCopy } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { useAccount, useWaitForTransaction } from "wagmi";

export function ExistingForm() {
  const [root, setRoot] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [amount, setAmount] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm();

  const handleAmountChange = (e: any) => {
    const value = e.target.value;
    // Check if the input is a number
    if (/^[0-9\b]+$/.test(value)) {
      setAmount(value);
    }
  };

  const CLONES_ADDRESS = "0xb1432c4e51c1bd10435f5a0754f1d86d7eddb694";
  const SPOILS_ADDRESS = "0xf86e36eacfcb23d9616b27cf5c1324c5597995a4";

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

  const { writeAsync: init } = useLootInitialize(initConfig);

  const { config: approveConfig } = usePrepareErc20Approve({
    address: tokenAddress as `0x${string}`,
    args: [cloneData?.result as `0x${string}`, BigInt(amount ?? "0")],
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
    (async () => {
      if (isSuccess && isApproveSuccess) {
        await init?.();

        setIsComplete(true);
      }
    })();
  }, [init, isSuccess, root, isApproveSuccess]);

  const handleCopyClick = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Reset the copy feedback after 3 seconds
  if (isCopied) {
    setTimeout(() => setIsCopied(false), 3000);
  }

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

  return (
    <>
      {isComplete ? (
        <>
          <p className="font-medium">Your Loot address</p>
          <p className="mb-4 text-sm text-white/80">
            Save this address for future use
          </p>
          <div className="flex h-12 w-full items-center justify-between rounded-lg border border-white/10 bg-dark p-4 text-white outline-none">
            <p>{cloneData?.result}</p>
            <button onClick={() => handleCopyClick(cloneData?.result ?? "")}>
              {isCopied ? <FaCheck /> : <FaRegCopy />}
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit(handleCloneAndInit)}>
          <p className="mb-2 font-medium">Token address</p>
          <input
            {...register("tokenAddress", {
              required: "Token address is required",
              pattern: {
                value: /^0x[a-fA-F0-9]{40}$/,
                message: "Invalid Ethereum address",
              },
            })}
            className="mb-4 h-12 w-full rounded-lg border border-white/10 bg-dark p-4 text-white outline-none"
            type="text"
            placeholder="Enter the token address"
          />
          {errors.tokenAddress && <span>This field is required</span>}

          <p className="mb-2 font-medium">Amount for each instance</p>
          <input
            {...register("amount", {
              required: true,
              pattern: /^[0-9\b]+$/,
            })}
            value={amount}
            onChange={handleAmountChange}
            className="mb-4 h-12 w-full rounded-lg border border-white/10 bg-dark p-4 text-white outline-none"
            type="text"
            placeholder="0"
          />
          {/* {errors.amount && (
                            <span>Please enter a valid number</span>
                          )} */}

          <p className="mb-2 font-medium">
            Whitelist file <span className="opacity-50">(.txt)</span>
          </p>
          <input
            {...register("file", { required: true })}
            type="file"
            accept=".txt"
            id="fileInput"
            className="mb-4 w-full rounded-md border border-white/10 bg-dark p-4 text-sm font-medium leading-4 text-white focus:outline-none"
          />
          {/* {errors.file && <span>Please select a file</span>} */}

          {address ? (
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-sage text-dark hover:bg-sage/90
                              ${
                                !isValid || isLoading
                                  ? "cursor-default opacity-50"
                                  : ""
                              }`}
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
          ) : (
            <button
              type="button"
              onClick={openConnectModal}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-sage text-dark hover:bg-sage/90"
            >
              Connect Wallet
            </button>
          )}
        </form>
      )}
    </>
  );
}
