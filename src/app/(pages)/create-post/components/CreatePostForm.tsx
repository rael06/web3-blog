"use client";

import { useState } from "react";
import { z } from "zod";
import { useWalletContext } from "@/app/contexts/WalletContext";
import { createPost } from "@/usecases/blog/createPost";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Alert,
  Button,
} from "@mui/material";
import CreationConfirmedDialog from "./CreationConfirmedDialog";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  category: z.string().min(1, "Category is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image must be less than 3MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png, and .gif formats are accepted",
    })
    .nullable(),
});

export default function CreatePostForm() {
  const { account, provider } = useWalletContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionData, setTransactionData] = useState<Awaited<
    ReturnType<typeof createPost>
  > | null>(null);

  const [title, setTitle] = useState("title");
  const [body, setBody] = useState("body");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{
    title?: string[];
    body?: string[];
    category?: string[];
    image?: string[];
  }>({});
  const [submissionError, setSubmissionError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const validate = () => {
    const result = postSchema.safeParse({
      title,
      body,
      category,
      image,
    });

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (!provider) {
        throw new Error("Provider not connected");
      }

      const transactionData = await createPost({
        provider,
        postData: {
          title,
          body,
          category,
          image,
        },
      });

      setTransactionData(transactionData);
      setIsDialogOpen(true);
    } catch (error) {
      console.error(error);
      setSubmissionError("Failed to create post. Please try again.");
    }
  };

  return (
    <>
      {transactionData && (
        <CreationConfirmedDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          transactionData={transactionData}
        />
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        {account && provider ? (
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title?.[0]}
              fullWidth
              required
            />
            <TextField
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              error={!!errors.body}
              helperText={errors.body?.[0]}
              fullWidth
              required
              multiline
              rows={4}
            />
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              error={!!errors.category}
              helperText={errors.category?.[0]}
              fullWidth
              required
            />
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {errors.image && (
              <Typography color="error">{errors.image[0]}</Typography>
            )}
            <Button type="submit" variant="contained" color="primary">
              Create Post
            </Button>
            {submissionError && (
              <Alert severity="error">{submissionError}</Alert>
            )}
          </Stack>
        ) : (
          <Typography variant="body1">
            Please connect your wallet to create a post.
          </Typography>
        )}
      </Box>
    </>
  );
}
