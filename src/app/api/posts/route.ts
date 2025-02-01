// app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as ipfs from "@/app/api/ipfs";

// Define the schema for validation
const submissionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const json = await request.json();
    const data = submissionSchema.parse(json);

    const ipfsHash = await ipfs.addData(data);

    return NextResponse.json({ cid: ipfsHash }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    // Handle other errors
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
