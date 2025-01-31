"use client";

import { useEffect, useRef } from "react";
import { useWalletContext } from "@/app/contexts/WalletContext";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { blogAbi } from "@/app/services/contract";
import { addData } from "@/app/api/ipfs";

export async function createPost({
  contractAddress,
  provider,
  data: { title, content },
}: {
  contractAddress: string;
  provider: ethers.BrowserProvider;
  data: { title: string; content: string };
}) {
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(contractAddress, blogAbi, signer);

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

export default function CreatePostForm() {
  const { account, provider, connect } = useWalletContext();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!account || !provider) {
      connect();
    }
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = titleRef.current?.value;
    const content = contentRef.current?.value;
    if (!title || !content) {
      // Todo: show error
      console.log("not valid");
      return;
    }

    if (!provider) {
      // Todo: show error
      console.log("not connected");
      return;
    }

    const data = { title, content };

    const ipfsHash = await addData(data);

    await createPost({
      contractAddress: process.env.NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS!,
      provider,
      data: { title, content: ipfsHash },
    });
    router.push(`/posts`);
  };

  return (
    <div>
      {account && provider && (
        <>
          <input type="text" placeholder="Title" ref={titleRef} />
          <input type="text" placeholder="Content" ref={contentRef} />
          <button type="submit" onClick={submit}>
            Create Post
          </button>
        </>
      )}
      {(!account || !provider) && (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
