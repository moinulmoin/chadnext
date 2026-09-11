"use client";

import { useMutation, useQuery } from "convex/react";
import { BrainCircuit, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Transparency panel: everything Sigma remembers about the user, with
 * one-click delete. Nothing is stored that isn't shown here.
 */
export function SigmaMemories() {
  const memoriesQuery = useQuery(api.sigma.listMemories, {});
  const deleteMemory = useMutation(api.sigma.deleteMemory);

  const memories = (memoriesQuery ?? []) as Array<{
    _id: string;
    content: string;
    createdAt: number;
  }>;

  const handleDelete = async (memoryId: string) => {
    try {
      await deleteMemory({ memoryId });
      toast.success("Memory deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete memory.",
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-primary" />
          What Sigma knows
        </CardTitle>
        <CardDescription>
          Facts Sigma has picked up from your conversations. Delete anything
          you don&apos;t want it to remember.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {memoriesQuery === undefined ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : memories.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            Nothing yet — Sigma only remembers simple facts you share in chat
            (like your name or preferences).
          </p>
        ) : (
          <ul className="divide-y rounded-md border">
            {memories.map((memory) => (
              <li
                key={memory._id}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <span className="text-sm">{memory.content}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(memory._id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete memory</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
