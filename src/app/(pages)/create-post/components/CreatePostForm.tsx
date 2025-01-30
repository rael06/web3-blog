"use client";

import { useEffect, useRef } from "react";
import { useWalletContext } from "../../../contexts/WalletContext";
import { createPost } from "@/app/api/blog";
import { useRouter } from "next/navigation";

export default function CreatePostForm() {
  const { account, connect } = useWalletContext();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!account) {
      connect();
    }
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = titleRef.current?.value;
    const content = contentRef.current?.value;
    if (!title || !content) {
      console.log("not valid");
      return;
    }

    console.log("submit", title, content);
    const { id } = await createPost(title, content);
    router.push(`/posts/${id}`);
  };

  return (
    <div>
      <input type="text" placeholder="Title" ref={titleRef} />
      <input type="text" placeholder="Content" ref={contentRef} />
      <button type="submit" onClick={submit}>
        Create Post
      </button>
    </div>
  );
}
