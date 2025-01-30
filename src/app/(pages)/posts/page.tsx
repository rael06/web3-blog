import Link from "next/link";
import { fetchPosts } from "../../api/blog";

export default async function Page() {
  // await createPost("Title 2", "Content 2");
  // await updatePost("3", "Title 3", "Content 3", true);
  const posts = await fetchPosts();

  return (
    <div>
      <Link href="/create-post">CreatePost</Link>
      <ul>
        {posts.map((post) => (
          <div key={post.id}>
            <Link href={`/posts/${post.id}`}>
              {post.id.padStart(3, "0")}: {post.title}, content: {post.content}
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
}
