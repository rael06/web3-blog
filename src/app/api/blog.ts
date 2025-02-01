"use server";

import { ethers } from "ethers";
import {
  PostModel,
  contractPostModelSchema,
  postModelContentSchema,
} from "@/app/models/post";
import { envVars } from "@/app/services/envVars";
import { blogAbi } from "@/app/services/contract";
import { getData } from "./ipfs";

export async function fetchPosts(): Promise<PostModel[]> {
  const provider = new ethers.JsonRpcProvider(envVars.BLOCKCHAIN_RPC_URL);
  const contract = new ethers.Contract(
    envVars.BLOG_CONTRACT_ADDRESS,
    blogAbi,
    provider
  );

  const contractPosts = (await contract.fetchPosts()).map((post: any) => ({
    id: post.id.toString(),
    title: post.title,
    content: post.content,
    isPublished: post.isPublished,
  }));

  const parsedContractPosts = [];
  for (const post of contractPosts) {
    const parsed = await safeParsePostContractModel(post);
    if (parsed.success) parsedContractPosts.push(parsed.data);
  }

  const posts = [];

  for (const post of parsedContractPosts) {
    const parsedContent = await postModelContentSchema.safeParseAsync(
      await getData(post.content)
    );
    if (parsedContent.success)
      posts.push({
        id: post.id.toString(),
        title: post.title,
        content: parsedContent.data,
        isPublished: post.isPublished,
      });
  }

  return posts;
}

async function safeParsePostContractModel(post: unknown) {
  return contractPostModelSchema.safeParseAsync(post);
}
