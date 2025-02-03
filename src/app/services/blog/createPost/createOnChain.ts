import { ethers } from "ethers";
import { blogAbi } from "@/app/services/contracts/blog";

export async function createPostOnChain({
  contractAddress,
  provider,
  data: { cid, category },
}: {
  contractAddress: string;
  provider: ethers.BrowserProvider;
  data: { cid: string; category: string };
}): Promise<{ id: string; txHash: string }> {
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(contractAddress, blogAbi, signer);

  const tx = await contract.createPost(cid, category);
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
    return { id: postId, txHash: receipt.hash };
  } else {
    throw new Error("PostCreated event not found in transaction logs.");
  }
}
