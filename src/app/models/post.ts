import { z } from "zod";

export const contractPostModelSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  isPublished: z.boolean(),
});

export type ContractPostModel = z.infer<typeof contractPostModelSchema>;

export const postModelContentSchema = z.object({
  title: z.string(),
  body: z.string(),
  image: z.string().optional(),
});

export type PostContentModel = z.infer<typeof postModelContentSchema>;

export type PostModel = {
  id: string;
  title: string;
  content: PostContentModel;
  isPublished: boolean;
};
