"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import AuthForm from "./auth-form";
import { useRouter } from "next/navigation";

export default function SignInModal() {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <Image
                src="/chad-next.png"
                alt="ChadNext logo"
                width="24"
                height="24"
                className="mr-2 rounded-sm object-contain"
              />
              <p>ChadNext</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}
