import { PostModel } from "../models/post";

type Props = {
  post: PostModel;
};

export function Post({ post }: Props) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content.body}</p>
    </div>
  );
}
