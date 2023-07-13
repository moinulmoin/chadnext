"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/use-toast";
import {
  saRemoveNewImageFromCDN,
  saRemoveUserOldImageFromCDN,
  saUpdateUserInDb,
} from "~/server/actions";
import { type CurrentUser } from "~/types";

const ImageUploadModal = dynamic(
  () => import("~/components/layout/image-upload-modal")
);

const CancelConfirmModal = dynamic(
  () => import("~/components/layout/cancel-confirm-modal")
);

const settingsSchema = z.object({
  image: z.string().url(),
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

export type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsForm({
  currentUser,
}: {
  currentUser: CurrentUser;
}) {
  const oldImage = useRef("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pendingForSubmit, startTransitionForSubmit] = useTransition();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
    values: {
      name: currentUser.name,
      email: currentUser.email,
      shortBio: currentUser.shortBio,
      image: currentUser.image,
    },
  });

  const { formState, getFieldState } = form;
  const { isDirty: isImageChanged } = getFieldState("image");

  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  useEffect(() => {
    if (isImageChanged && currentUser.image !== oldImage.current) {
      oldImage.current = currentUser.image;
    }
  }, [currentUser.image, isImageChanged]);

  function onSubmit(data: SettingsValues) {
    if (!formState.isDirty) return;

    if (isImageChanged) {
      startTransitionForSubmit(() =>
        saRemoveUserOldImageFromCDN(currentUser.id, data.image)
          .then(() => saUpdateUserInDb(currentUser.id, data))
          .then(() => {
            toast({
              title: "Updated successfully!",
            });
          })
          .catch(() => {
            toast({
              title: "Something went wrong.",
              variant: "destructive",
            });
          })
      );
    } else {
      startTransitionForSubmit(() =>
        saUpdateUserInDb(currentUser.id, data)
          .then(() => {
            toast({
              title: "Updated successfully!",
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
  }

  function handleReset() {
    if (isImageChanged) {
      saRemoveNewImageFromCDN(form.getValues().image)
        .then(() => form.reset())
        .catch((error) => console.error(error));
    } else {
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-8 "
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Avatar className="group relative h-28 w-28 rounded-full">
                  <AvatarImage src={field.value} alt={form.getValues().name} />
                  <AvatarFallback className=" text-xs">
                    {form.getValues().name}
                  </AvatarFallback>
                  <ImageUploadModal onChange={field.onChange} />
                </Avatar>
              </FormControl>
              <FormDescription>
                Click on the avatar to upload new one.
              </FormDescription>
            </FormItem>
          )}
        ></FormField>
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

        <div>
          <CancelConfirmModal
            setShow={setShowConfirmAlert}
            show={showConfirmAlert}
            reset={handleReset}
            isDirty={formState.isDirty}
          />

          <Button type="submit" disabled={!formState.isDirty}>
            {formState.isSubmitting || pendingForSubmit ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
