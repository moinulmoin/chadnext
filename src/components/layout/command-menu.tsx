"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const SUGGESTED_PROMPTS = [
  "How many runs today?",
  "Show my recent runs",
  "What's my usage?",
  "Create a run about a launch announcement",
];

/**
 * Global ⌘K "Ask Sigma" entry: search input navigates to the chat with the
 * prompt pre-filled via ?q=.
 */
export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const ask = useCallback(
    (prompt: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/dashboard/chat?q=${encodeURIComponent(prompt)}`);
    },
    [router],
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="h-3.5 w-3.5" />
        Ask Sigma
        <kbd className="pointer-events-none ml-1 hidden rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Ask Sigma anything about your data…"
        />
        <CommandList>
          <CommandEmpty>
            Press Enter to ask Sigma: “{query}”
          </CommandEmpty>
          <CommandGroup heading="Ask Sigma">
            <CommandItem
              value={query || "ask-sigma"}
              onSelect={() => ask(query || "How many runs today?")}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {query ? `Ask: ${query}` : "Ask Sigma"}
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Suggested">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <CommandItem
                key={prompt}
                value={prompt}
                onSelect={() => ask(prompt)}
              >
                {prompt}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
