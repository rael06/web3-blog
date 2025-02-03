import { formatDate } from "@/app/services/formatters";
import { serverEnvVars } from "@/app/services/serverEnvVars";
import { fetchPosts } from "@/usecases/blog/fetchPosts";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import Link from "next/link";

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

  if (!post) {
    return (
      <Box>
        <Typography variant="body1">Post not found</Typography>
      </Box>
    );
  }
  return (
    <Card
      key={post.id}
      sx={{ m: 2 }}
      component={Link}
      href={`/posts/${post.id}`}
    >
      <CardActionArea>
        {post.content.imageCid && (
          <CardMedia
            component="img"
            height="140"
            image={`${serverEnvVars.IPFS_GET_URL}/${post.content.imageCid}`}
            alt={post.content.title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {post.content.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.content.body}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {post.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            By {post.authorAddress}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            {formatDate(post.createdAt)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
