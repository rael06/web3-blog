"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useWalletContext } from "@/app/contexts/WalletContext";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import CreationConfirmationDialog from "./CreationConfirmationDialog";

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

  const [title, setTitle] = useState("title");
  const [body, setBody] = useState("body");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    title?: string[];
    body?: string[];
    category?: string[];
    image?: string[];
  }>({});

  useEffect(() => {
    // Cleanup the object URL when the component unmounts or when a new image is selected
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedImage = files[0];
      setImage(selectedImage);
      // Generate a preview URL for the selected image
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
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

    setIsDialogOpen(true);
  };

  return (
    <>
      <CreationConfirmationDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        postData={{ title, body, category, image }}
      />
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        {account && provider ? (
          <Stack spacing={2} alignItems="flex-start">
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
            <Box display="flex" justifyContent={"space-between"} width="100%">
              <Button
                variant="contained"
                component="label"
                sx={{ width: "auto" }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: "auto" }}
              >
                Create Post
              </Button>
            </Box>
            {imagePreview && (
              <Box
                component="img"
                src={imagePreview}
                alt="Image Preview"
                sx={{ height: 300, mt: 2 }}
              />
            )}
            {errors.image && (
              <Typography color="error">{errors.image[0]}</Typography>
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
