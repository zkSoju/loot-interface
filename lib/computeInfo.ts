import { ClaimInfo } from "@/lib/types";

export const computeInfo = async (
  holders: string[],
  amountForEach: number
): Promise<ClaimInfo> => {
  const addressCounts: ClaimInfo = {};

  for (const holder of holders) {
    if (addressCounts[holder]) {
      addressCounts[holder]++;
    } else {
      addressCounts[holder] = 1;
    }
  }

  const claimAmounts: ClaimInfo = {};

  for (const [address, count] of Object.entries(addressCounts)) {
    claimAmounts[address.toLowerCase()] = count * amountForEach;
  }

  return claimAmounts;
};
