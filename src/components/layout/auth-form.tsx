"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

const userAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type FormData = z.infer<typeof userAuthSchema>;

export default function AuthForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOTP] = useState("");
  const [countdown, setCountdown] = useState(30);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function onEmailSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }
      setCurrentStep(2);
      toast({
        title: "OTP sent!",
        description: "Please check your mail inbox",
      });
      setCountdown(30);
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onOTPSubmit(data: FormData) {
    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, code: otp }),
      });

      if (!res.ok) {
        throw new Error("Invalid OTP");
      }
      toast({
        title: "Successfully verified!",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Invalid OTP",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (!getValues("email")) return;
    await onEmailSubmit(getValues());
  }

  return (
    <div className={cn("mt-4 flex flex-col gap-4")}>
      {currentStep === 1 && (
        <>
          <form onSubmit={handleSubmit(onEmailSubmit)}>
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
                disabled={isLoading || isGithubLoading || isVerifying}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send OTP
              </button>
            </div>
          </form>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">/</span>
          </div>
          {isGithubLoading ? (
            <Button className="w-full cursor-not-allowed" variant="outline">
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
        </>
      )}
      {currentStep === 2 && (
        <>
          <p className="mb-4 text-balance">
            We&apos;ve sent a 6-digit code to your email. Please enter it below
            to verify your account.
          </p>
          <form
            onSubmit={handleSubmit(onOTPSubmit)}
            className="flex flex-col gap-2.5"
          >
            <div>
              <Label className="sr-only" htmlFor="otp">
                Enter OTP
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  id="otp"
                  autoFocus
                  disabled={isLoading}
                  value={otp}
                  onChange={setOTP}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="mt-4"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify OTP
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Didn&apos;t receive the code / expired?</span>
            {countdown > 0 ? (
              <span>Resend in {countdown}s</span>
            ) : (
              <Button
                variant="link"
                onClick={handleResend}
                className="h-auto p-0"
                disabled={isLoading}
              >
                Resend OTP
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
