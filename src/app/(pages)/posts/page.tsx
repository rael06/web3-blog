import Link from "next/link";
import { fetchPosts } from "@/usecases/blog/fetchPosts";

export const dynamic = "force-dynamic";

export default async function Page() {
  const posts = await fetchPosts();

  return (
    <div>
      <Link href="/create-post">CreatePost</Link>
      <ul>
        {posts.map((post) => (
          <div key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.id.padStart(3, "0")}</Link>
            <span>
              , cid: {post.cid}, title: {post.content.title}, content:{" "}
              {post.content.body}, image: {post.content.image}, createdAt:{" "}
              {post.createdAt.toISOString()}, authorAddress:{" "}
              {post.authorAddress}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
}
