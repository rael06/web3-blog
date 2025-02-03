import { z } from "zod";

export const contractPostModelSchema = z.object({
  id: z.string(),
  cid: z.string(),
  createdAt: z.date(),
  authorAddress: z.string(),
  category: z.string(),
  isPublished: z.boolean(),
  isDeleted: z.boolean(),
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
  cid: string;
  createdAt: Date;
  category: string;
  authorAddress: string;
  isPublished: boolean;
  isDeleted: boolean;
  content: PostContentModel;
};
