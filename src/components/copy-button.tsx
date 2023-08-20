"use client";

import React from "react";
import Icons from "./shared/icons";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export default function CopyButton({ content }: { content: string }) {
  const copyToClipboard = (content: string) => {
    if (!navigator.clipboard) {
      toast({
        title: "Error copying!",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    navigator.clipboard.writeText(content);
    toast({
      title: "Project ID copied!",
    });
  };

  return (
    <Button
      type="button"
      className="absolute right-0 top-0 h-full "
      size="icon"
      variant="ghost"
      onClick={() => copyToClipboard(content)}
    >
      <span className="sr-only">Copy</span>
      <Icons.copy className="h-3 w-3" />
    </Button>
  );
}
