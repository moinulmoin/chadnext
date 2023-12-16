"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Icons from "~/components/shared/icons";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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
import { FreePlanLimitError } from "~/lib/utils";
import { checkIfFreePlanLimitReached, createProject } from "./action";

export const projectSchema = z.object({
  name: z.string().min(1, { message: "Please enter a project name." }),
  domain: z.string().min(1, { message: "Please enter a project domain." }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export default function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      domain: "",
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    try {
      const limitReached = await checkIfFreePlanLimitReached();
      if (limitReached) {
        throw new FreePlanLimitError();
      }
      await createProject(values);
      toast({
        title: "Project created successfully.",
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error({ error });
      if (error instanceof FreePlanLimitError) {
        return toast({
          title: "Free plan limit reached. Please upgrade your plan.",
          variant: "destructive",
        });
      }
      return toast({
        title: "Error creating project. Please try again.",
        variant: "destructive",
      });
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card
          role="button"
          className="flex flex-col items-center justify-center gap-y-2.5 p-8 text-center hover:bg-accent"
        >
          <Button size="icon" variant="ghost">
            <Icons.projectPlus className="h-8 w-8 " />
          </Button>
          <p className="text-xl font-medium ">Create a project</p>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <DialogFooter>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting && (
                  <Icons.spinner className={"mr-2 h-5 w-5 animate-spin"} />
                )}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
