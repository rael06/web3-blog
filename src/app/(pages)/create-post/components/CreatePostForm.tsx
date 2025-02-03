"use client";

import { useEffect, useRef } from "react";
import { useWalletContext } from "@/app/contexts/WalletContext";
import { useRouter } from "next/navigation";
import { createPost } from "@/usecases/blog/createPost";

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

    try {
      if (!provider) {
        throw new Error("Provider not connected");
      }

      const title = titleRef.current?.value;
      const body = bodyRef.current?.value;
      const category = categoryRef.current?.value;

      const { id, txHash, cid } = await createPost({
        provider,
        postData: {
          title,
          body,
          category,
        },
      });

      const message = [
        `Post id ${id} created on chain`,
        `IPFS CID:`,
        `https://ipfs.io/ipfs/${cid}`,
        `Transaction:`,
        `${process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL}/tx/${txHash}`,
      ].join("\n");

      console.log(message);
      alert(message);

      router.push(`/posts`);
    } catch (error) {
      console.log(error);
    }
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
