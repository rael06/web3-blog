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
  return data;
}
