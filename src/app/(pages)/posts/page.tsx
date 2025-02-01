import Link from "next/link";
import { fetchPosts } from "@/app/api/blog";
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
              , cid: {post.content.cid}, title: {post.title}, content:{" "}
              {post.content.body}, image: {post.content.image}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
}
