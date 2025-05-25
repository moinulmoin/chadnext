"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import {
  githubSignIn,
  sendEmailOtp,
  verifyEmailOtp,
} from "~/lib/client/auth-client";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";

const userAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type FormData = z.infer<typeof userAuthSchema>;

export default function AuthForm() {
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
    let intervalId: NodeJS.Timeout | undefined;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [countdown]);

  async function onEmailSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const result = await sendEmailOtp(data.email);
      if (!result.data?.success) {
        throw new Error(result.error?.message);
      }
      setCurrentStep(2);
      toast({
        title: "OTP sent!",
        description: "Please check your mail inbox",
      });
      setCountdown(30);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Failed to send OTP",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onOTPSubmit(data: FormData) {
    setIsVerifying(true);

    try {
      const result = await verifyEmailOtp(data.email, otp);

      if (!result.data?.user) {
        throw new Error(result.error?.message);
      }
      setCountdown(0);
      reset();
      toast({
        title: "Successfully verified!",
      });
      window.location.href = "/dashboard";
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Failed to verify OTP",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (!getValues("email")) return;
    setCountdown(0);
    setOTP("");
    await onEmailSubmit(getValues());
  }

  async function handleGithubSignIn() {
    setIsGithubLoading(true);
    const result = await githubSignIn();
  }

  return (
    <div className={cn("mt-4 flex max-w-full flex-col gap-4")}>
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
              <Button
                type="submit"
                disabled={isLoading || isGithubLoading || isVerifying}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send OTP
              </Button>
            </div>
          </form>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">/</span>
          </div>
          {isGithubLoading ? (
            <Button className="w-full cursor-not-allowed" variant="outline">
              <Icons.spinner />
            </Button>
          ) : (
            <Button variant="outline" onClick={handleGithubSignIn}>
              Continue with <Icons.gitHub />
            </Button>
          )}
        </>
      )}
      {currentStep === 2 && (
        <>
          <p className="mb-4 text-center">
            <span className="break-all">
              We&apos;ve sent a 6-digit code to {getValues("email")}.
            </span>{" "}
            Please enter it below for verification.
          </p>
          <form
            onSubmit={handleSubmit(onOTPSubmit)}
            className="flex flex-col gap-2.5"
          >
            <div>
              <Label className="sr-only" htmlFor="otp">
                Enter OTP
              </Label>
              <div className="">
                <InputOTP
                  id="otp"
                  autoFocus
                  disabled={isLoading}
                  value={otp}
                  onChange={setOTP}
                  maxLength={6}
                  className="flex justify-between"
                >
                  <InputOTPGroup className="flex w-full items-center justify-between [&>div]:rounded-md [&>div]:border">
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
              {isVerifying && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify OTP
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Didn&apos;t receive the code/expired?</span>
            {countdown > 0 ? (
              <span>Resend in {countdown}s</span>
            ) : (
              <Button
                variant="link"
                onClick={handleResend}
                className="h-auto p-0"
                disabled={isLoading}
              >
                {isLoading ? "Resending..." : "Resend"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
