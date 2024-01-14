"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import AuthForm from "./auth-form";

export default function LoginModal() {
  const router = useRouter();
  const pathname = usePathname();

  const IsOpen = pathname.includes("/login");

  return (
    <Dialog open={IsOpen} onOpenChange={() => router.push("/")}>
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
