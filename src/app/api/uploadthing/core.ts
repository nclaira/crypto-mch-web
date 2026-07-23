import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Handles PDF eBook uploads (max 32MB)
  docUploader: f({
    pdf: { maxFileSize: "32MB" },
    video: { maxFileSize: "512MB" },
  }).onUploadComplete(({ file }) => {
    // file.url is the CDN URL — saved to MongoDB via the admin form
    console.log("Upload complete:", file.url);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
