import ImageWithFallback from "@/app/components/ImageWithFallback";
import { formatDate } from "@/app/services/formatters";
import { serverEnvVars } from "@/app/services/serverEnvVars";
import { fetchPosts } from "@/usecases/blog/fetchPosts";
import { Card, CardContent, Typography, Box, Container } from "@mui/material";
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
    <Container>
      <Card key={post.id} sx={{ m: 2, p: 2 }}>
        <ImageWithFallback
          src={
            post.content.imageCid
              ? `${serverEnvVars.IPFS_GET_URL}/${post.content.imageCid}`
              : "/no-image-fallback.png"
          }
          fallbackSrc="/ipfs-in-progress-fallback.png"
          alt={post.content.title}
          sx={{ height: "400px", objectFit: "contain" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {post.content.title}
          </Typography>
          <Typography variant="body1" mt={2}>
            {post.content.body}
          </Typography>
          <Typography variant="body2" mt={2}>
            Post ID: {post.id}
          </Typography>
          <Typography variant="body2">
            IPFS CID:{" "}
            <Link
              href={`${process.env.NEXT_PUBLIC_IPFS_GET_URL}/${post.cid}`}
              target="_blank"
            >
              {post.cid}
            </Link>
          </Typography>
          <Typography variant="body2" mt={2}>
            Category: {post.category}
          </Typography>
          <Typography variant="body2">By {post.authorAddress}</Typography>
          <Typography variant="body2">{formatDate(post.createdAt)}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
