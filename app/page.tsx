import { ActionMenu } from "@/components/action-menu";
import Image from "next/image";

export default function Home() {
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
                  <p className="text-xl font-medium">ShareLoot</p>
                  <p className="text-sm text-white/80">
                    Distribute tokens to your community and more
                  </p>
                </div>
              </div>
              <div className="mb-8 h-px w-full bg-white/10"></div>
            </div>
            <ActionMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
