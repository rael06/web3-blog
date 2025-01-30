import hre from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer?.address);

  const Blog = await hre.ethers.getContractFactory("Blog");
  const blog = await Blog.deploy("Rael's Web3 Blog");

  // Wait for the deployment transaction to be mined
  await blog.deploymentTransaction()?.wait();

  fs.writeFileSync(
    "./accounts-config.ts",
    `
  export const ownerAddress = "${deployer?.address}";
  export const contractAddress = "${(await blog.getAddress()).toString()}";
  `
  );

  console.log("Blog deployed to:", await blog.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
