import Link from "next/link";
import { fetchPosts } from "../../api/blog";
import { getData } from "@/app/api/ipfs";
import { PostModel } from "@/app/models/post";

export default async function Page() {
  const posts = await fetchPosts();
  const postsView: PostModel[] = await Promise.all(
    posts.map(async (post) => {
      const data = await getData(post.content);
      return { ...post, ...data };
    })
  );

  return (
    <div>
      <Link href="/create-post">CreatePost</Link>
      <ul>
        {postsView.map((post) => (
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
