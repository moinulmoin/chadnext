"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { useSearchParams } from "next/navigation";

const userAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type FormData = z.infer<typeof userAuthSchema>;

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const res = await signIn("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (!res?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your signin request failed. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description:
          "We sent you a sign in link. Be sure to check your spam too.",
      });
      return reset();
    }
  }
  return (
    <div className={cn("mt-4 flex flex-col gap-4")}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2.5">
          <div>
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              disabled={isLoading || isGithubLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            className={cn(buttonVariants())}
            disabled={isLoading || isGithubLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGithubLoading(true);
          signIn("github", { callbackUrl });
        }}
        disabled={isLoading || isGithubLoading}
      >
        {isGithubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Continue with Github
      </button>
    </div>
  );
}
