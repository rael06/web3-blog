import { ethers } from "hardhat";
import { BlogV1Abi, BlogV1Address } from "./contractUtils";

async function deletePost() {
  const [deployer] = await ethers.getSigners();

  const contract = new ethers.Contract(BlogV1Address, BlogV1Abi, deployer);

  const postId = 35;
  console.log(`Deleting post: ${postId}...`);
  const tx = await contract.deletePost?.(postId);

  console.log("Waiting for transaction confirmation...");
  const receipt = await tx.wait();
  console.log(`Transaction confirmed!`, JSON.stringify(receipt, null, 2));
}

deletePost().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
