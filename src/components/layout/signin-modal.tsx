"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import AuthForm from "./auth-form";

export default function SignInModal() {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="w-full max-w-[400px] rounded-md">
        <DialogHeader>
          <DialogTitle>
            <h2 className=" font-semibold tracking-tight transition-colors">
              Welcome Back 👋
            </h2>
          </DialogTitle>
        </DialogHeader>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}
