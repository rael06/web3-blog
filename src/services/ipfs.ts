import { create } from "kubo-rpc-client";
import { serverEnvVars } from "@/app/services/serverEnvVars";

const ipfs = create({ url: serverEnvVars.IPFS_API_URL });

export async function addData(
  data: Record<string, unknown> | Record<string, unknown>[]
): Promise<string> {
  const { cid } = await ipfs.add(JSON.stringify(data));
  if (serverEnvVars.IS_IPFS_PIN_ENABLED) await ipfs.pin.add(cid);
  return cid.toString();
}

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
