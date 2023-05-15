import MerkleTree from "merkletreejs";
import { NextRequest, NextResponse } from "next/server";
import { encodePacked, keccak256 } from "viem";

type ClaimInfo = {
  [address: string]: number;
};

type AddressInfo = {
  [address: string]: `0x${string}`;
};

type LeafInfo = {
  [leaf: string]: {
    index: number;
    amount: number;
  };
};

type Data = {
  [address: string]: {
    index: number;
    amount: number;
    proof: string[];
  };
};

export const config = {
  runtime: "experimental-edge",
};

const computeInfo = async (
  holders: string[],
  totalAirdrop: number
): Promise<ClaimInfo> => {
  const addressCounts: ClaimInfo = {};

  for (const holder of holders) {
    if (addressCounts[holder]) {
      addressCounts[holder]++;
    } else {
      addressCounts[holder] = 1;
    }
  }

  const totalAddresses = holders.length;

  const claimAmounts: ClaimInfo = {};

  for (const [address, count] of Object.entries(addressCounts)) {
    claimAmounts[address] = Math.floor((count / totalAddresses) * totalAirdrop);
  }

  return claimAmounts;
};

export async function POST(req: NextRequest) {
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
        ["uint256", "address", "uint32"],
        [BigInt(index), key as `0x${string}`, value]
      )
    );

    leafToData[addressToLeaf[key]] = {
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
    const leafData = leafToData[leaf];
    data[address] = {
      index: leafData.index,
      amount: leafData.amount,
      proof: proof,
    };
  }

  return NextResponse.json({ data });
}
