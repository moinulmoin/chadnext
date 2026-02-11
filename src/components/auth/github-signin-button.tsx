"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Github } from "lucide-react";

export function GitHubSignInButton() {
  const signInWithGitHub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  return (
    <Button onClick={signInWithGitHub} variant="outline" className="w-full">
      <Github className="mr-2 h-4 w-4" />
      Continue with GitHub
    </Button>
  );
}
