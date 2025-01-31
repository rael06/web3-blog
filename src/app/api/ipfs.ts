"use server";

import { create } from "kubo-rpc-client";

// Connect to your local IPFS node
const ipfs = create({ url: "http://localhost:5001" }); // Adjust the URL if your IPFS node is hosted elsewhere

// Function to add data to IPFS
export async function addData(
  data: Record<string, unknown> | Record<string, unknown>[]
): Promise<string> {
  const { cid } = await ipfs.add(JSON.stringify(data));
  console.log("Data added with CID:", cid.toString());
  return cid.toString();
}

// Function to retrieve data from IPFS
export async function getData(cid: string) {
  try {
    const stream = ipfs.cat(cid);
    let data = "";

    for await (const chunk of stream) {
      data += chunk.toString();
    }

    console.log("Retrieved data:", data);
    return data;
  } catch (error) {
    console.error("Error retrieving data from IPFS:", error);
  }
}
