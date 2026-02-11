"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

type EmailFormValues = {
  email: string
}

type OtpFormValues = {
  otp: string
}

export default function LoginPage() {
  const [isGithubPending, setIsGithubPending] = useState(false)
  const [isOtpPending, setIsOtpPending] = useState(false)
  const [isVerifyPending, setIsVerifyPending] = useState(false)
  const [emailForOtp, setEmailForOtp] = useState("")
  const router = useRouter()

  const emailForm = useForm<EmailFormValues>({
    defaultValues: {
      email: "",
    },
  })

  const otpForm = useForm<OtpFormValues>({
    defaultValues: {
      otp: "",
    },
  })

  const onGithubLogin = async () => {
    setIsGithubPending(true)
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      })
    } catch {
      toast.error("Could not start GitHub login")
    } finally {
      setIsGithubPending(false)
    }
  }

  const onSendOtp = async ({ email }: EmailFormValues) => {
    setIsOtpPending(true)
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      })

      if (error) {
        toast.error(error.message ?? "Failed to send OTP")
        return
      }

      setEmailForOtp(email)
      toast.success("Code sent to your email")
    } catch {
      toast.error("Failed to send OTP")
    } finally {
      setIsOtpPending(false)
    }
  }

  const onVerifyOtp = async ({ otp }: OtpFormValues) => {
    if (!emailForOtp) {
      toast.error("Enter your email first")
      return
    }

    setIsVerifyPending(true)
    try {
      const { error } = await authClient.signIn.emailOtp({
        email: emailForOtp,
        otp,
      })

      if (error) {
        toast.error(error.message ?? "Invalid OTP")
        return
      }

      toast.success("Signed in")
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("Failed to verify OTP")
    } finally {
      setIsVerifyPending(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-8">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-border/70 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in or create an account using GitHub or email OTP</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onGithubLogin}
            disabled={isGithubPending}
          >
            {isGithubPending ? "Redirecting..." : "Continue with GitHub"}
          </Button>

          <div className="relative text-center text-xs uppercase text-muted-foreground">
            <span className="bg-card px-2">or use email OTP</span>
            <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
          </div>

          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-3">
              <FormField
                control={emailForm.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isOtpPending}>
                {isOtpPending ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </Form>

          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-3">
              <FormField
                control={otpForm.control}
                name="otp"
                rules={{
                  required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                  maxLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6-digit code</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="123456"
                        autoComplete="one-time-code"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isVerifyPending}>
                {isVerifyPending ? "Verifying..." : "Verify OTP and continue"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
