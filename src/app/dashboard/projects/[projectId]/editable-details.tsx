"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CopyButton from "~/components/copy-button";
import Icons from "~/components/shared/icons";
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
import { toast } from "~/components/ui/use-toast";
import { updateProjectById } from "../action";
import { z } from "zod";

const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(50).nonempty({
    message: "Please enter a project name.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export default function EditableDetails({
  initialValues,
}: {
  initialValues: ProjectFormValues;
}) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    values: initialValues,
  });

  async function onSubmit(values: ProjectFormValues) {
    try {
      await updateProjectById(initialValues.id, values);
      toast({
        title: "Project created successfully.",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating project.",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-6">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project ID</FormLabel>
              <FormControl>
                <div className="relative ">
                  <Input placeholder="XYZ" disabled {...field} />
                  <CopyButton content={form.getValues("id")} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="XYZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Website</FormLabel>
              <FormControl>
                <Input placeholder="https://xyz.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          type="submit"
        >
          {form.formState.isSubmitting && (
            <Icons.spinner className={"mr-2 h-5 w-5 animate-spin "} />
          )}
          Save
        </Button>
      </form>
    </Form>
  );
}
