import { ethers } from "ethers";
import BlogArtifact from "../../../hardhat/artifacts/contracts/Blog.sol/Blog.json";

export const blogAbi = (
  BlogArtifact as unknown as {
    abi: ConstructorParameters<typeof ethers.Contract>[1];
  }
).abi;
