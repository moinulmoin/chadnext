import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getPageSession } from "~/lib/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await getPageSession();

      // If you throw, the user will not be able to upload
      if (!session) throw new Error("Unauthorized!");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.userId };
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
