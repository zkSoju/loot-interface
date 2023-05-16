"use client";

import { CreateForm } from "@/components/create-form";
import { ExistingForm } from "@/components/existing-form";
import Image from "next/image";
import { useState } from "react";

export function ActionMenu() {
  const [selectedAction, setSelectedAction] = useState<string>();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectAction = (action: string) => {
    setSelectedAction(action);
  };

  return (
    <div className="flex flex-col">
      {!isConfirmed && (
        <>
          <p className="mb-2 text-lg font-medium">Actions</p>
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
                  <p className="mr-2 font-medium text-white">Starter project</p>
                  <p className="rounded-md border border-sage px-2 py-1 text-xs text-sage">
                    RECCOMENDED
                  </p>
                </div>
                <p className="text-xs text-white/80">
                  Deploy your own rewards contract using an existing token in a
                  few clicks.
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
                Generate a merkle tree without deploying a contract and serve it
                yourself.
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
        <>{selectedAction === "create" ? <CreateForm /> : <ExistingForm />}</>
      )}
    </div>
  );
}
