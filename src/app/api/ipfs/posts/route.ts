import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as ipfs from "@/services/ipfs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const title = formData.get("title");
    const body = formData.get("body");
    const category = formData.get("category");
    const image = formData.get("image") as File | null;

    // Validate the fields
    const schema = z.object({
      title: z.string().min(1, "Title is required"),
      body: z.string().min(1, "Body is required"),
      category: z.string().min(1, "Category is required"),
    });

    const data = schema.parse({ title, body, category });

    let imageCid;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageCid = await ipfs.addFile(buffer);
      // You can now use 'buffer' to upload to IPFS or any other storage
    }

    // Add data to IPFS
    const cid = await ipfs.addData({ ...data, imageCid });

    return NextResponse.json({ cid }, { status: 201 });
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
