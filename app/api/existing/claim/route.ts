import { db } from "@/lib/db";
import { LootData } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    const user = req.nextUrl.searchParams.get("user");

    if (!address) {
      return NextResponse.error();
    }

    const loot = await db.loot.findUnique({
      where: {
        lootAddress: address,
      },
    });

    if (!loot) {
      return NextResponse.error();
    }

    const data = loot.data as LootData;

    const userClaim = data.data?.[user as string];

    if (userClaim) {
      return NextResponse.json(userClaim);
    }

    return NextResponse.json({
      index: -1,
      amount: 0,
      proof: [],
    });
  } catch (e) {
    return NextResponse.error();
  }
}
