import { ethers } from "hardhat";
import { BlogV1Abi } from "./contractUtils";

async function deletePost(postId: number) {
  const [deployer] = await ethers.getSigners();

  const contract = new ethers.Contract(
    process.env.BLOG_CONTRACT_ADDRESS!,
    BlogV1Abi,
    deployer
  );

  console.log(`Deleting post: ${postId}...`);
  const tx = await contract.deletePost?.(postId);

  console.log("Waiting for transaction confirmation...");
  const receipt = await tx.wait();
  console.log(`Transaction confirmed!`, JSON.stringify(receipt, null, 2));
}

deletePost(40).catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
