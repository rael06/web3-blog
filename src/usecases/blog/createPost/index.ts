import { BrowserProvider } from "ethers";
import { createPostOnChain } from "./createOnChain";
import { createPostOnIpfs } from "./createOnIpfs";

export async function createPost({
  provider,
  postData,
}: {
  provider: BrowserProvider;
  postData: {
    title: string;
    body: string;
    category: string;
    image: File | null;
  };
}) {
  const cid = await createPostOnIpfs(postData);

  const onChainData = await createPostOnChain({
    contractAddress: process.env.NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS!,
    provider,
    data: { cid, category: postData.category },
  });
  return { ...onChainData, cid };
}
