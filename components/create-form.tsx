"use client";

import { LootData } from "@/lib/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsDownload, BsStars } from "react-icons/bs";
import { ClipLoader } from "react-spinners";

export function CreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();
  const [data, setData] = useState<LootData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e: any) => {
    const value = e.target.value;
    // Check if the input is a number
    if (/^[0-9\b]+$/.test(value)) {
      setAmount(value);
    }
  };

  const handleUpload = async (formData: any) => {
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
            amount: formData.amount.toString(),
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

  return (
    <form onSubmit={handleSubmit(handleUpload)}>
      <p className="mb-2 font-medium">Amount for each instance</p>
      <input
        {...register("amount", {
          required: "Amount is required",
          pattern: {
            value: /^[0-9]+$/,
            message: "Invalid amount",
          },
        })}
        value={amount}
        onChange={handleAmountChange}
        className="mb-4 h-12 w-full rounded-lg border border-white/10 bg-dark p-4 text-white outline-none"
        type="text"
        placeholder="0"
      />
      <p className="mb-2 font-medium">
        Whitelist file <span className="opacity-80">(.txt)</span>
      </p>
      <input
        {...register("file", {
          required: "File is required",
        })}
        type="file"
        accept=".txt"
        id="fileInput"
        className="mb-4 w-full rounded-md border border-white/10 bg-dark p-4 text-sm font-medium leading-4 text-white"
      />
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-sage text-dark hover:bg-sage/90 disabled:cursor-default disabled:opacity-50"
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
          className="mt-4 flex h-12 w-full items-center justify-center rounded-lg border border-sage text-white"
        >
          <div className="flex items-center">
            <p className="text-white">Download JSON</p>
            <BsDownload className="ml-2 text-white" />
          </div>
        </button>
      )}
    </form>
  );
}
