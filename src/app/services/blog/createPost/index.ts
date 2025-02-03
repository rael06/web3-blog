import { BrowserProvider } from "ethers";
import { createPostOnChain } from "./createOnChain";
import { z } from "zod";
import { createPostOnIpfs } from "./createOnIpfs";

export async function createPost({
  provider,
  postData,
}: {
  provider: BrowserProvider;
  postData: unknown;
}) {
  const validatedPostData = await z
    .object({
      title: z.string(),
      body: z.string(),
      category: z.string(),
    })
    .parseAsync(postData);

  const cid = await createPostOnIpfs(validatedPostData);

  const onChainData = await createPostOnChain({
    contractAddress: process.env.NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS!,
    provider,
    data: { cid, category: validatedPostData.category },
  });
  return { ...onChainData, cid };
}
