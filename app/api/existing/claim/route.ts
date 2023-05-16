import { LootData } from "@/lib/types";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    const user = req.nextUrl.searchParams.get("user");

    if (!address) {
      return NextResponse.error();
    }

    const fileContents: LootData = await kv.json.get(address);

    const userClaim = fileContents?.data[user as string];

    if (!userClaim) {
      return NextResponse.json({
        index: -1,
        amount: 0,
        proof: [],
      });
    }

    return NextResponse.json(userClaim);
  } catch (e) {
    console.log(e);
    return NextResponse.error();
  }
}
