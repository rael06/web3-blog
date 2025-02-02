"use client";

import { useEffect, useRef } from "react";
import { useWalletContext } from "@/app/contexts/WalletContext";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { blogAbi } from "@/app/services/contract";
import { z } from "zod";

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

export default function CreatePostForm() {
  const { account, provider, connect } = useWalletContext();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!account || !provider) {
      connect();
    }
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = titleRef.current?.value;
    const body = bodyRef.current?.value;
    const category = categoryRef.current?.value;
    if (!title || !body || !category) {
      // Todo: show error
      console.log("not valid");
      return;
    }

    if (!provider) {
      // Todo: show error
      console.log("not connected");
      return;
    }

    const data = { title, body };

    const response = await fetch(`/api/ipfs/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to upload post on IPFS");
    }

    const responseBody = await response.json();
    const parsedResponseBody = z
      .object({ cid: z.string() })
      .safeParse(responseBody);
    if (!parsedResponseBody.success) {
      throw new Error("Response body is not valid");
    }

    const ipfsHash = parsedResponseBody.data.cid;

    const { txHash, id } = await createPostOnChain({
      contractAddress: process.env.NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS!,
      provider,
      data: { cid: ipfsHash, category },
    });
    alert(
      [
        `Post id ${id} created on chain`,
        `IPFS CID:`,
        `https://ipfs.io/ipfs/${ipfsHash}`,
        `Transaction:`,
        `${process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL}/tx/${txHash}`,
      ].join("\n")
    );
    router.push(`/posts`);
  };

  return (
    <div>
      {account && provider && (
        <>
          <p>Connected as: {account}</p>
          <input type="text" placeholder="Title" ref={titleRef} />
          <input type="text" placeholder="Body" ref={bodyRef} />
          <input
            type="text"
            placeholder="Category"
            ref={categoryRef}
            defaultValue="general"
          />
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
