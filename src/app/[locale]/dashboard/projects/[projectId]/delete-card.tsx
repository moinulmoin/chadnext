"use client";
import { useTransition } from "react";
import Icons from "~/components/shared/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { toast } from "~/components/ui/use-toast";
import { deleteProjectById } from "../action";

export default function DeleteCard({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(() =>
      deleteProjectById(id)
        .then(() => {
          toast({
            title: "Project deleted successfully.",
          });
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Error deleting project.",
            description: "Please try again.",
            variant: "destructive",
          });
        })
    );
  };
  return (
    <Card className="mt-5 flex items-center justify-between p-6">
      <div>
        <CardTitle className=" mb-2.5">Delete Project</CardTitle>
        <CardDescription>
          The project will be permanently deleted. This action is irreversible
          and can not be undone.
        </CardDescription>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDelete}>
                {pending && (
                  <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                )}
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
