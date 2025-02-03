import { fetchPosts } from "@/usecases/blog/fetchPosts";
import Image from "next/image";

export const revalidate = 3600;

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await fetchPosts();

  return posts;
}

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const id = (await params).postId;
  const post = await fetchPosts().then((posts) =>
    posts.find((p) => p.id === id)
  );
  return (
    <main>
      <h1>{id}</h1>
      {post?.content.image && (
        <Image
          src={post?.content.image}
          alt={post?.content.title}
          width={400}
          height={400}
        />
      )}
      <p>TITLE: {post?.content.title}</p>
      <p>CREATED AT: {post?.createdAt.toISOString()}</p>
      <p>AUTHOR ADDRESS: {post?.authorAddress}</p>
      <p>CATEGORY: {post?.category}</p>
      <p>IPFS CID: {post?.cid}</p>
      <p>BODY: {post?.content.body}</p>
    </main>
  );
}
