import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "../server/auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()],
});

export const githubSignIn = async () => {
  return authClient.signIn.social({
    provider: "github",
  });
};

export const sendEmailOtp = async (email: string) => {
  return authClient.emailOtp.sendVerificationOtp({
    email,
    type: "sign-in",
  });
};

export const verifyEmailOtp = async (email: string, otp: string) => {
  return authClient.signIn.emailOtp({
    email,
    otp,
  });
};

export const logout = async () => {
  return authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/login";
      },
    },
  });
};
