import { clonesAbi } from "@/abis/Clones";
import { spoilsOfWarAbi } from "@/abis/SpoilsOfWar";
import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20ABI } from "wagmi";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "SpoilsOfWar",
      abi: spoilsOfWarAbi,
    },
    {
      name: "Clones",
      abi: clonesAbi,
    },
    {
      name: "erc20",
      abi: erc20ABI,
    },
  ],
  plugins: [react()],
});
