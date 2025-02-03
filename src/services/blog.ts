"use server";

import { ethers } from "ethers";
import {
  PostModel,
  contractPostModelSchema,
  postModelContentSchema,
} from "@/models/post";
import { serverEnvVars } from "@/services/serverEnvVars";
import { blogAbi } from "@/contracts/blog";
import { getData } from "./ipfs";

export async function fetchPosts(): Promise<PostModel[]> {
  const provider = new ethers.JsonRpcProvider(serverEnvVars.BLOCKCHAIN_RPC_URL);
  const contract = new ethers.Contract(
    serverEnvVars.BLOG_CONTRACT_ADDRESS,
    blogAbi,
    provider
  );

  const page = await contract.getPostsPaginated(
    0,
    10,
    false,
    ethers.ZeroAddress,
    "",
    0,
    0
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
      const parsedContent = await postModelContentSchema.safeParseAsync(
        await getData(post.cid)
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
    } catch (e) {
      console.log(e);
    }
  }

  return posts;
}

async function safeParsePostContractModel(post: unknown) {
  return contractPostModelSchema.safeParseAsync(post);
}
