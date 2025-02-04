import Link from "next/link";
import { fetchPosts } from "@/usecases/blog/fetchPosts";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { serverEnvVars } from "@/app/services/serverEnvVars";
import { formatDate, truncateText } from "@/app/services/formatters";
import ImageWithFallback from "@/app/components/ImageWithFallback";

export const dynamic = "force-dynamic";

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
          <Card key={post.id} sx={{ m: 2 }}>
            <CardActionArea component={Link} href={`/posts/${post.id}`}>
              <Grid container>
                <Grid size={2} p={2}>
                  <ImageWithFallback
                    src={
                      post.content.imageCid
                        ? `${serverEnvVars.IPFS_GET_URL}/${post.content.imageCid}`
                        : "/no-image-fallback.png"
                    }
                    fallbackSrc="/ipfs-in-progress-fallback.png"
                    alt={post.content.title}
                    sx={{ maxHeight: "100%" }}
                  />
                </Grid>
                <Grid size={8}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {post.content.title}
                    </Typography>
                    <Typography variant="body2">
                      {truncateText(post.content.body, 100)}
                    </Typography>
                    <Typography variant="body2" mt={2}>
                      Category: {post.category}
                    </Typography>
                    <Typography variant="body2">
                      By {post.authorAddress}
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(post.createdAt)}
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Page;
