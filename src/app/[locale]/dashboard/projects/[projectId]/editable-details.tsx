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
import { projectSchema, type ProjectFormValues } from "../create-project-modal";

// const projectEditSchema = projectSchema.extend({
//   id: z.string().readonly(),
// });

// type ProjectEditValues = z.infer<typeof projectEditSchema>;

export default function EditableDetails({
  initialValues,
}: {
  initialValues: ProjectFormValues & { id: string };
}) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    values: initialValues,
  });

  async function onSubmit(values: ProjectFormValues) {
    try {
      await updateProjectById(initialValues.id, values);
      toast({
        title: "Project Updated successfully.",
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
        <FormItem>
          <FormLabel>ID</FormLabel>
          <FormControl>
            <div className="relative ">
              <Input value={initialValues.id} readOnly disabled />
              <CopyButton content={initialValues.id} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="XYZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input placeholder="xyz.com" {...field} />
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
