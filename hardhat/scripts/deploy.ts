import hre from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) throw new Error("No deployer account found");

  console.log("Deploying contracts with the account:", deployer.address);

  const BlogV1 = await hre.ethers.getContractFactory("BlogV1");

  // Deploy Proxy
  const blog = await hre.upgrades.deployProxy(BlogV1, [deployer.address], {
    initializer: "initialize",
  });

  // Wait for deployment confirmation
  await blog.waitForDeployment();

  // Get the proxy contract address
  const contractAddress = await blog.getAddress();

  // Save contract address to a file
  fs.writeFileSync(
    "./accounts-config.ts",
    `
  export const ownerAddress = "${deployer.address}";
  export const contractAddress = "${contractAddress}";
  `
  );

  console.log("BlogV1 deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
