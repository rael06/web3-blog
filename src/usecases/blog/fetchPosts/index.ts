import { ethers } from "ethers";
import {
  PostModel,
  contractPostModelSchema,
  postModelContentSchema,
} from "@/models/post";
import { serverEnvVars } from "@/app/services/serverEnvVars";
import { blogAbi } from "@/contracts/blog";
import { getData } from "../../../services/ipfs";

export async function fetchPosts(filter?: {
  startIndex?: number;
  count?: number;
  reverse?: boolean;
  authorFilter?: string;
  categoryFilter?: string;
  fromTimestamp?: number;
  toTimestamp?: number;
}): Promise<PostModel[]> {
  const {
    startIndex,
    count,
    reverse,
    authorFilter,
    categoryFilter,
    fromTimestamp,
    toTimestamp,
  } = {
    startIndex: filter?.startIndex || 0,
    count: filter?.count || 10,
    reverse: filter?.reverse || true,
    authorFilter: filter?.authorFilter || ethers.ZeroAddress,
    categoryFilter: filter?.categoryFilter || "",
    fromTimestamp: filter?.fromTimestamp || 0,
    toTimestamp: filter?.toTimestamp || 0,
  };

  const provider = new ethers.JsonRpcProvider(serverEnvVars.BLOCKCHAIN_RPC_URL);
  const contract = new ethers.Contract(
    serverEnvVars.BLOG_CONTRACT_ADDRESS,
    blogAbi,
    provider
  );

  const page = await contract.getPostsPaginated(
    startIndex,
    count,
    reverse,
    authorFilter,
    categoryFilter,
    fromTimestamp,
    toTimestamp
  );
  const contractPosts = page[0]?.map((post: any) => ({
    id: post.id.toString(),
    cid: post.cid,
    createdAt: new Date(Number(post.createdAt) * 1000),
    authorAddress: post.author,
    category: post.category,
    isPublished: post.isPublished,
    isDeleted: post.isDeleted,
  }));

  const parsedContractPosts = [];
  for (const post of contractPosts) {
    const parsed = await safeParsePostContractModel(post);
    if (parsed.success) parsedContractPosts.push(parsed.data);
  }

  const posts: PostModel[] = [];
  for (const post of parsedContractPosts) {
    try {
      const content = await getData(post.cid);
      const parsedContent = await postModelContentSchema.safeParseAsync(
        content
      );
      if (parsedContent.success)
        posts.push({
          id: post.id.toString(),
          cid: post.cid,
          createdAt: post.createdAt,
          authorAddress: post.authorAddress,
          category: post.category,
          content: parsedContent.data,
          isPublished: post.isPublished,
          isDeleted: post.isDeleted,
        });
      else
        console.log(
          "Failed to parse post content from IPFS",
          parsedContent.error
        );
    } catch (e) {
      console.log(e);
    }
  }

  return posts;
}

async function safeParsePostContractModel(post: unknown) {
  return contractPostModelSchema.safeParseAsync(post);
}
