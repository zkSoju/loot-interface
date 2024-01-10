import { computeInfo } from "@/lib/computeInfo";
import { AddressInfo, Data, LeafInfo } from "@/lib/types";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import { NextRequest, NextResponse } from "next/server";
import { encodePacked } from "viem";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const fileContent = json.fileContent;
    const whitelist = fileContent.split("\n");

    const amount = req.nextUrl.searchParams.get("amount");

    if (!amount) {
      return NextResponse.error();
    }

    const claimAmounts = await computeInfo(whitelist, Number(amount));

    const addressToLeaf: AddressInfo = {};
    const leafToData: LeafInfo = {};

    Object.entries(claimAmounts).forEach(([key, value], index) => {
      addressToLeaf[key] = keccak256(
        encodePacked(
          ["uint256", "address", "uint256"],
          [BigInt(index), key as `0x${string}`, BigInt(value)]
        )
      );

      leafToData[addressToLeaf[key].toString()] = {
        index: index,
        amount: value,
      };
    });

    const leaves = Object.values(addressToLeaf);

    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });
    const root = tree.getHexRoot();

    console.log(tree.verify(tree.getHexProof(leaves[0]), leaves[0], root));

    let data: Data = {};

    for (const [address, leaf] of Object.entries(addressToLeaf)) {
      const proof = tree.getHexProof(leaf);
      const leafData = leafToData[leaf.toString()];
      data[address] = {
        index: leafData.index,
        amount: leafData.amount,
        proof: proof,
      };
    }

    return NextResponse.json({ root: root, data: data });
  } catch (e) {
    console.log(e);
    return NextResponse.error();
  }
}
