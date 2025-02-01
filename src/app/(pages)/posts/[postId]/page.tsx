import { fetchPosts } from "@/app/api/blog";
import Image from "next/image";

export const revalidate = 300;

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
      <h1>{post?.title}</h1>
      <p>{post?.content.body}</p>
      <p>{post?.content.cid}</p>
      {post?.content.image && (
        <Image
          src={post?.content.image}
          alt={post?.title}
          width={400}
          height={400}
        />
      )}
    </main>
  );
}
