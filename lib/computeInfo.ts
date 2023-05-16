import { ClaimInfo } from "@/lib/types";

export const computeInfo = async (
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
