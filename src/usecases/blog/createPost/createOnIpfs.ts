import { z } from "zod";

export async function createPostOnIpfs(data: {
  title: string;
  body: string;
}): Promise<string> {
  const response = await fetch(`/api/ipfs/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to upload post on IPFS");
  }

  const responseBody = await response.json();
  const parsedResponseBody = z
    .object({ cid: z.string() })
    .safeParse(responseBody);
  if (!parsedResponseBody.success) {
    throw new Error("Response body is not valid");
  }

  const ipfsHash = parsedResponseBody.data.cid;

  return ipfsHash;
}
