"use server";

import { ethers } from "ethers";
import { PostModel } from "../models/post";
import { envVars } from "../services/envVars";
import { blogAbi } from "../services/contract";

export async function fetchPosts(): Promise<PostModel[]> {
  // TODO: configure provider in .env
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

export async function createPost(title: string, content: string) {
  const provider = new ethers.JsonRpcProvider(envVars.BLOCKCHAIN_RPC_URL);
  const signer = new ethers.Wallet(envVars.BLOG_CONTRACT_OWNER_PK, provider);
  const contract = new ethers.Contract(
    envVars.BLOG_CONTRACT_ADDRESS,
    blogAbi,
    signer
  );

  const tx = await contract.createPost(title, content);
  const receipt = await tx.wait();

  const eventFragment = contract.interface.getEvent("PostCreated");

  const eventLogs = receipt.logs
    .map((log: any) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        throw new Error("Failed to parse log");
      }
    })
    .filter((log: any) => log && log.name === eventFragment?.name);

  if (eventLogs.length > 0) {
    const postId = eventLogs[0].args.id.toString();
    console.log("New post created with ID:", postId);
    return { id: postId, txHash: receipt.transactionHash };
  } else {
    console.log("PostCreated event not found in transaction logs.");
    throw new Error("PostCreated event not found in transaction logs.");
  }
}

export async function updatePost(
  id: string,
  title: string,
  content: string,
  isPublished: boolean
) {
  const provider = new ethers.JsonRpcProvider(envVars.BLOCKCHAIN_RPC_URL);
  const signer = new ethers.Wallet(envVars.BLOG_CONTRACT_OWNER_PK, provider);
  const contract = new ethers.Contract(
    envVars.BLOG_CONTRACT_ADDRESS,
    blogAbi,
    signer
  );

  const tx = await contract.updatePost(id, title, content, isPublished);

  // Wait for the transaction to be mined
  console.log("Waiting for transaction confirmation...");
  const receipt = await tx.wait();
  console.log(`Transaction confirmed!`, JSON.stringify(receipt, null, 2));
}
