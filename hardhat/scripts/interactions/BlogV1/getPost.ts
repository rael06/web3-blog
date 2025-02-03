import { ethers } from "hardhat";
import { BlogV1Abi } from "./contractUtils";

async function getPost(postId: number) {
  const [deployer] = await ethers.getSigners();

  const contract = new ethers.Contract(
    process.env.BLOG_CONTRACT_ADDRESS!,
    BlogV1Abi,
    deployer
  );

  console.log(`Getting post: ${postId}...`);
  const post = await contract.getPost?.(postId);
  const jsonString = JSON.stringify(
    post,
    (_, value) => (typeof value === "bigint" ? value.toString() : value),
    2
  );
  console.log(`Post ${postId}:`, jsonString);
}

getPost(36).catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
