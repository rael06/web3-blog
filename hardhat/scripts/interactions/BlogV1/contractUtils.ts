import { ethers } from "hardhat";
import BlogV1Artifact from "../../../artifacts/contracts/BlogV1.sol/BlogV1.json";

export const BlogV1Abi = (
  BlogV1Artifact as unknown as {
    abi: ConstructorParameters<typeof ethers.Contract>[1];
  }
).abi;
