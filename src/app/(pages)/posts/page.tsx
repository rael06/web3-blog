import Link from "next/link";
import { fetchPosts } from "../../api/blog";

export default async function Page() {
  const posts = await fetchPosts();

  return (
    <div>
      <Link href="/create-post">CreatePost</Link>
      <ul>
        {posts.map((post) => (
          <div key={post.id}>
            <Link href={`/posts/${post.id}`}>
              {post.id.padStart(3, "0")}: {post.title}, content:{" "}
              {post.content.body}
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
}
