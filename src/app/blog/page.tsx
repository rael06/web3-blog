import { fetchPosts } from "../api/blog";
import { Post } from "../components/Post";

export default async function Page() {
  // await createPost("Title 2", "Content 2");
  // await updatePost("3", "Title 3", "Content 3", true);
  const posts = await fetchPosts();

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  );
}
