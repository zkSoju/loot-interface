export type Test = {};

export type ClaimInfo = {
  [address: string]: number;
};

export type AddressInfo = {
  [address: string]: Buffer;
};

export type LeafInfo = {
  [leaf: string]: {
    amount: number;
  };
};

export type Data = {
  [address: string]: {
    amount: number;
    proof: string[];
  };
};

export type LootData = {
  root: string;
  data: {
    [key: string]: ClaimData;
  };
};

export type ClaimData = {
  index: number;
  amount: number;
  proof: string[];
};
