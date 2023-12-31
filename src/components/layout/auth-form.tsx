"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

const userAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type FormData = z.infer<typeof userAuthSchema>;

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

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

    try {
      const res = await fetch("/api/auth/login/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setIsLoading(false);

      if (!res.ok) {
        return toast({
          title: "Failed to send Magic link!",
          description: "Please try again later.",
          variant: "destructive",
        });
      }

      reset();
      toast({
        title: "Magic Link sent!",
        description: "Please check your mail inbox",
      });
    } catch (error) {
      console.log(error);
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
              <p className="mt-2 text-xs text-destructive">
                {errors?.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isLoading || isGithubLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send magic link
          </button>
        </div>
      </form>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">/</span>
      </div>
      {isGithubLoading ? (
        <Button className=" w-full cursor-not-allowed" variant="outline">
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Link
          href="/api/auth/login/github"
          className={cn(buttonVariants({ variant: "outline" }))}
          onClick={() => setIsGithubLoading(true)}
        >
          Continue with <Icons.gitHub className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
