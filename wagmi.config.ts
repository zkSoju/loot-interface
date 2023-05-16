import { clonesAbi } from "@/abis/Clones";
import { lootAbi } from "@/abis/Loot";
import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20ABI } from "wagmi";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "Loot",
      abi: lootAbi,
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
