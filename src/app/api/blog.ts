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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Wait for the transaction to be mined
  console.log("Waiting for transaction confirmation...");
  const receipt = await tx.wait();
  console.log(`Transaction confirmed!`, JSON.stringify(receipt, null, 2));
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
