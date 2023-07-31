import { z } from "zod";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  shortBio: string;
};

export interface payload {
  name: string;
  email: string;
  shortBio?: string;
  image?: string;
}

export const settingsSchema = z.object({
  image: z.string().url(),
  name: z
    .string({
      required_error: "Please type your name.",
    })
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(50, {
      message: "Name must be at most 50 characters.",
    }),
  email: z.string().email(),
  shortBio: z.string().optional(),
});

export type SettingsValues = z.infer<typeof settingsSchema>;
