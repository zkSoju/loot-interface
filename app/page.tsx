"use client";

import Image from "next/image";
import { useState } from "react";
import { BsStars } from "react-icons/bs";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const handleAmountChange = (event: any) => {
    setAmount(event.target.value);
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
        "/api/whitelist?" +
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

  return (
    <div>
      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        <div className="shadow-me relative flex w-[32rem] flex-col items-start rounded-lg bg-white p-2">
          <div className="radial pointer-events-none absolute h-full w-full rounded-lg"></div>
          <div className="flex h-full w-full flex-col justify-between p-4">
            <div className="flex flex-col">
              <div className="mb-4 flex items-center">
                <div className="shadow-me relative mr-4 h-16 w-16 rounded-md bg-white p-1">
                  <div className="relative h-full w-full overflow-hidden rounded-md">
                    <Image
                      src="/ice.png"
                      fill
                      className="object-cover"
                      alt=""
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-medium">Crystalize</p>
                  <p className="text-sm text-dark/80">
                    Generate a merkle tree from file
                  </p>
                </div>
              </div>
              <div className="mb-8 h-px w-full bg-black/10"></div>
            </div>
            <div className="flex flex-col">
              <p className="mb-2 font-medium">Amount to distribute</p>
              <input
                className="mb-4 h-12 w-full rounded-lg bg-[#efeff7ff] p-4"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter the amount of tokens to distribute"
              />
              <p className="mb-2 font-medium">Whitelist file</p>
              <input
                type="file"
                accept=".txt"
                id="fileInput"
                className="w-full rounded-md border border-gray-300 bg-white p-4 text-sm font-medium leading-4 text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <button
                onClick={handleUpload}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-lg border border-slate-500 bg-dark text-white"
              >
                {isLoading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  <div className="flex items-center">
                    <p className="text-white">Generate</p>
                    <BsStars className="ml-2 text-white" />
                  </div>
                )}
              </button>
              {data && (
                <button
                  onClick={downloadJson}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-lg border border-slate-500 bg-dark text-white"
                >
                  Download JSON
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
