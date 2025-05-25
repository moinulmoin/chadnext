"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useTransition } from "react";
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
import { useToast } from "~/hooks/use-toast";
import { settingsSchema, type SettingsValues } from "~/types";
import {
  removeNewImageFromCDN,
  removeUserOldImageFromCDN,
  updateUser,
} from "./actions";

const ImageUploadModal = dynamic(
  () => import("~/components/layout/image-upload-modal")
);
const CancelConfirmModal = dynamic(
  () => import("~/components/layout/cancel-confirm-modal")
);

export default function SettingsForm({
  currentUser,
}: {
  currentUser: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}) {
  const oldImage = useRef(currentUser.image ?? "");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: currentUser.name ?? "",
      email: currentUser.email ?? "",
      image: currentUser.image ?? "",
    },
  });

  const { formState, getFieldState, handleSubmit, reset, getValues } = form;
  const { isDirty: isImageChanged } = getFieldState("image");

  useEffect(() => {
    reset({
      name: currentUser.name ?? "",
      email: currentUser.email ?? "",
      image: currentUser.image ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (isImageChanged && currentUser.image !== oldImage.current) {
      oldImage.current = currentUser.image ?? "";
    }
  }, [currentUser.image, isImageChanged]);

  const onSubmit = handleSubmit((data: SettingsValues) => {
    startTransition(async () => {
      try {
        if (currentUser.image && isImageChanged) {
          await removeUserOldImageFromCDN(data.image, currentUser.image);
        }
        await updateUser(currentUser.id, data);
        toast({ title: "Updated successfully!" });
      } catch (error) {
        console.log(JSON.stringify(error));
        toast({ title: "Something went wrong.", variant: "destructive" });
      }
    });
  });

  const handleReset = async () => {
    if (isImageChanged) {
      try {
        await removeNewImageFromCDN(getValues().image);
      } catch (error) {
        console.log(error);
      }
    }
    reset();
  };

  const isFormDisabled = useMemo(
    () => formState.isSubmitting || isPending || !formState.isDirty,
    [formState.isSubmitting, isPending, formState.isDirty]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="max-w-2xl space-y-8 rounded-md border p-6"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Picture</FormLabel>
              <FormDescription>
                Click on the avatar to upload new one.
              </FormDescription>
              <FormControl>
                <Avatar className="group relative h-28 w-28 rounded-full">
                  <AvatarImage src={field.value} alt={getValues().name} />
                  <AvatarFallback className="text-xs">
                    {getValues().name?.[0] ?? "U"}
                  </AvatarFallback>
                  <ImageUploadModal onImageChange={field.onChange} />
                </Avatar>
              </FormControl>
            </FormItem>
          )}
        />
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
                  className="bg-muted"
                  readOnly
                  placeholder="Your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="inline-flex gap-x-4">
          <CancelConfirmModal reset={handleReset} isDisabled={isFormDisabled} />

          <Button type="submit" disabled={isFormDisabled}>
            {isPending ? (
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
