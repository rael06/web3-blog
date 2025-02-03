import { z } from "zod";

export async function createPostOnIpfs(data: {
  title: string;
  body: string;
  category: string;
  image: File | null;
}): Promise<string> {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("body", data.body);
  formData.append("category", data.category);

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await fetch("/api/ipfs/posts", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload post to IPFS");
  }

  const responseBody = await response.json();
  const parsedResponseBody = z
    .object({ cid: z.string() })
    .safeParse(responseBody);
  if (!parsedResponseBody.success) {
    throw new Error("Response body is not valid");
  }

  const cid = parsedResponseBody.data.cid;
  return cid;
}
