"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import { settingsSchema, type CurrentUser, type SettingsValues } from "~/types";

const ImageUploadModal = dynamic(
  () => import("~/components/layout/image-upload-modal")
);

const CancelConfirmModal = dynamic(
  () => import("~/components/layout/cancel-confirm-modal")
);

export default function SettingsForm({
  currentUser,
}: {
  currentUser: CurrentUser;
}) {
  const oldImage = useRef("");
  const [pending, startTransition] = useTransition();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
    values: {
      name: currentUser.name,
      email: currentUser.email,
      shortBio: currentUser.shortBio || "",
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
      startTransition(() =>
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
      startTransition(() =>
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
                  className="resize-none bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex">
          <CancelConfirmModal
            setShow={setShowConfirmAlert}
            show={showConfirmAlert}
            reset={handleReset}
            isDisabled={formState.isSubmitting || pending || !formState.isDirty}
          />

          <Button
            type="submit"
            disabled={formState.isSubmitting || pending || !formState.isDirty}
          >
            {formState.isSubmitting || pending ? (
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
