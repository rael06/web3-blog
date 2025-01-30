"use server";

import { ethers } from "ethers";
import { PostModel } from "../models/post";
import { envVars } from "@/app/services/envVars";
import { blogAbi } from "@/app/services/contract";

export async function fetchPosts(): Promise<PostModel[]> {
  const provider = new ethers.JsonRpcProvider(envVars.BLOCKCHAIN_RPC_URL);
  const contract = new ethers.Contract(
    envVars.BLOG_CONTRACT_ADDRESS,
    blogAbi,
    provider
  );

  // TODO: validate
  const posts = (await contract.fetchPosts()).map((post: any) => ({
    id: post.id.toString(),
    title: post.title,
    content: post.content,
    isPublished: post.isPublished,
  }));

  return posts;
}
