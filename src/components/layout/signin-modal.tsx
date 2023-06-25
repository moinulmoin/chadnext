"use client";

import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import AuthForm from "./auth-form";

export default function SignInModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign In</Button>
      </DialogTrigger>
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
