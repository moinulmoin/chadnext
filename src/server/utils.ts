export const isOurCdnUrl = (url: string) =>
  url?.includes("utfs.io") || url?.includes("uploadthing.com");

export const getImageKeyFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts.at(-1);
};

export class FreePlanLimitError extends Error {
  constructor(message = "Upgrade your plan!") {
    super(message);
  }
}
