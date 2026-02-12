"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Plus, Rocket } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Project = Doc<"projects">;

const FREE_PLAN_LIMIT = 3;

export default function ProjectsPage() {
  const projects = useQuery(api.projects.list) as Project[] | undefined;
  const createProject = useMutation(api.projects.create);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectCount = projects?.length ?? 0;
  const freeLimitReached = projectCount >= FREE_PLAN_LIMIT;

  const projectLabel = useMemo(() => {
    if (projectCount === 1) {
      return "1 project";
    }
    return `${projectCount} projects`;
  }, [projectCount]);

  const resetCreateForm = () => {
    setName("");
    setDescription("");
    setDomain("");
    setCreateError(null);
  };

  const handleCreate = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!name.trim()) {
      setCreateError("Project name is required.");
      return;
    }

    setIsSubmitting(true);
    setCreateError(null);

    try {
      await createProject({
        name,
        description: description || undefined,
        domain: domain || undefined,
      });

      toast.success("Project created");
      resetCreateForm();
      setDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create project.";
      setCreateError(message);

      if (message.includes("Free plan limited to 3 projects")) {
        toast.error("Free plan limit reached", {
          description: "Upgrade to Pro for unlimited projects.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage your AI SaaS projects and deployment domains.</p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              resetCreateForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Start a new project. Free plan includes up to {FREE_PLAN_LIMIT} projects.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Customer Support Bot"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Input
                  id="project-description"
                  placeholder="AI assistant for support tickets"
                  value={description}
                  onChange={(e: any) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-domain">Domain</Label>
                <Input
                  id="project-domain"
                  placeholder="support.example.com"
                  value={domain}
                  onChange={(e: any) => setDomain(e.target.value)}
                />
              </div>

              {createError ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {createError}
                </div>
              ) : null}

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>{projectLabel} on Free plan</CardDescription>
          </div>
          <Badge variant={freeLimitReached ? "destructive" : "secondary"}>
            {projectCount}/{FREE_PLAN_LIMIT}
          </Badge>
        </CardHeader>
        {freeLimitReached ? (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              You have reached the free plan limit. Upgrade to Pro to create more projects.
            </p>
          </CardContent>
        ) : null}
      </Card>

      {projects === undefined ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">Loading projects...</CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Rocket className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">No projects yet</p>
              <p className="text-sm text-muted-foreground">Create your first project to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3 text-base">
                  <span className="truncate">{project.name}</span>
                  <Badge variant={project.status === "active" ? "default" : "outline"}>{project.status}</Badge>
                </CardTitle>
                <CardDescription className="line-clamp-2">{project.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{project.domain || "No domain set"}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/projects/${project._id}`}>Manage</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
