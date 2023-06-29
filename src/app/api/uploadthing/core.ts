import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { utapi } from "uploadthing/server";
import db from "~/lib/db";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f(["image"])
    // Set permissions and file types for this FileRoute
    .middleware(async (req) => {
      // This code runs on your server before upload
      const token = await getToken({ req });

      // If you throw, the user will not be able to upload
      if (!token) throw new Error("Unauthorized!");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: token.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      const foundUser = await db.user.findFirst({
        where: { id: metadata.userId },
      });

      if (!foundUser) throw new Error("User not found!");

      const url = foundUser.image as string;
      const parts = url.split("/");
      const fileKey = parts[parts.length - 1];

      try {
        await utapi.deleteFiles(fileKey);

        await db.user.update({
          where: { id: metadata.userId },
          data: {
            image: file.url,
          },
        });
        revalidatePath("/dashboard/settings");
      } catch (e) {
        await utapi.deleteFiles(file.key);
        throw new Error("Failed to delete old image!");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
