import "server-only";

import { create } from "kubo-rpc-client";
import { serverEnvVars } from "@/app/services/serverEnvVars";

// Connect to your local IPFS node
const ipfs = create({ url: serverEnvVars.IPFS_API_URL }); // Adjust the URL if your IPFS node is hosted elsewhere

// Function to add data to IPFS
export async function addData(
  data: Record<string, unknown> | Record<string, unknown>[]
): Promise<string> {
  console.log(JSON.stringify(serverEnvVars));
  const { cid } = await ipfs.add(JSON.stringify(data));
  if (serverEnvVars.IS_IPFS_PIN_ENABLED) await ipfs.pin.add(cid);
  console.log("Data added with CID:", cid.toString());
  return cid.toString();
}

// Function to retrieve data from IPFS
export async function getData(cid: string): Promise<unknown> {
  const decoder = new TextDecoder();
  let content = "";

  for await (const chunk of ipfs.cat(cid)) {
    content += decoder.decode(chunk, { stream: true });
  }

  // Decode any remaining bytes in the buffer
  content += decoder.decode();

  // Parse the JSON string into an object
  const data = JSON.parse(content);
  console.log(`Data cid ${cid} retrieved:`, data);
  return data;
}
