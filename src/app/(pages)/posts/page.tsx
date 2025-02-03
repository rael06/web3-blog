import Link from "next/link";
import { fetchPosts } from "@/usecases/blog/fetchPosts";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import { serverEnvVars } from "@/app/services/serverEnvVars";

function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

const Page: React.FC = async () => {
  const posts = await fetchPosts();

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
        mb={2}
      >
        <Typography variant="h4" component="h1">
          Blog Posts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/create-post"
        >
          Create Post
        </Button>
      </Box>
      <Box display="flex" flexDirection="column">
        {posts.map((post) => (
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
                  {truncateText(post.content.body, 100)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {post.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By {post.authorAddress}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  {formatDate(post.createdAt)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Page;
