"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ImageUploadModal from "~/components/layout/image-upload-modal";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/use-toast";
import { updateUserToDb } from "~/server/actions";
import { type CurrentUser } from "~/types";

const settingsSchema = z.object({
  name: z
    .string({
      required_error: "Please type your name.",
    })
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(50, {
      message: "Name must be at most 50 characters.",
    }),
  email: z.string().email(),
  shortBio: z
    .string({
      required_error: "Please type a short bio.",
    })
    .max(150, {
      message: "Short bio must be at most 150 characters.",
    })
    .min(10, {
      message: "Short bio must be at least 10 characters.",
    }),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsForm({
  currentUser,
}: {
  currentUser: CurrentUser;
}) {
  const [pending, startTransition] = useTransition();
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
  });

  const { reset, formState } = form;
  const { name, email, shortBio, image } = currentUser;

  useEffect(() => {
    reset({
      name,
      email,
      shortBio,
    });
  }, [email, name, reset, shortBio]);

  function onSubmit(data: SettingsValues) {
    startTransition(() =>
      updateUserToDb(currentUser.id, data)
        .then(() => {
          toast({
            title: "Updated successfully.",
          });
        })
        .catch(() => {
          toast({
            title: "Something went wrong.",
            variant: "destructive",
          });
        })
    );
  }

  return (
    <Form {...form}>
      <Avatar className="group relative  h-28  w-28 rounded-full">
        <AvatarImage src={image} />
        <AvatarFallback>{name?.[0]}</AvatarFallback>
        <ImageUploadModal />
      </Avatar>
      <p className="mb-5 mt-3.5 text-xs text-muted-foreground">
        Click on the avatar to change it.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className=" bg-muted"
                  readOnly
                  placeholder="Your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={!formState.isDirty}>
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
}
