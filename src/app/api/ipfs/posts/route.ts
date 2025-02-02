// app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as ipfs from "@/app/services/ipfs";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const data = z
      .object({
        title: z.string().min(1, "Title is required"),
        body: z.string().min(1, "Body is required"),
      })
      .parse(json);

    const ipfsHash = await ipfs.addData(data);

    return NextResponse.json({ cid: ipfsHash }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
