"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    setIsLoading(true);

    const fileInput = document.getElementById("fileInput");

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = event.target.result;

      // Now, you can send fileContent to your API route
      const response = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileContent }),
      });

      const data = await response.json();
      setData(data);

      // Do something with the response data
    };

    reader.readAsText(file);

    setIsLoading(false);
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
        <div className="shadow-me relative flex h-96 w-96 flex-col items-start rounded-lg bg-white p-2">
          <div className="radial pointer-events-none absolute h-full w-full rounded-lg"></div>
          <div className="flex h-full w-full flex-col justify-between p-4">
            <div className="flex flex-col">
              <p className="text-lg font-medium">Snapshot</p>
              <p className="mb-8">Upload a text file</p>
            </div>
            <div className="flex flex-col">
              <input type="file" accept=".txt" id="fileInput" />
              <button
                onClick={handleUpload}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-dark text-white"
              >
                {isLoading ? "Loading..." : "Upload"}
              </button>
              {data && (
                <button
                  onClick={downloadJson}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-dark text-white"
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
