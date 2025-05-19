import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { authMiddleware } from "../server/auth";

export const actionClient = createSafeActionClient({
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string(),
    }),
  handleServerError: (e) => {
    console.error("Action error:", e.message);
    return {
      success: false,
      message: e.message,
    };
  },
});

export const authActionClient = actionClient.use(authMiddleware);
