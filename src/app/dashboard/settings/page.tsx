"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SigmaMemories } from "@/components/dashboard/sigma-memories";
import { api } from "../../../../convex/_generated/api";

export default function SettingsPage() {
  const profile = useQuery(api.users.getProfile);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newPictureFile, setNewPictureFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initializeForm = () => {
    if (profile) {
      setName(profile.name);
      setPreviewUrl(profile.picture || null);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB.",
      });
      return;
    }

    setNewPictureFile(file);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setNewPictureFile(null);
    setPreviewUrl(null);
  };

  const handleSave = async () => {
    if (!profile) return;

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);

    try {
      let storageId = undefined;

      if (newPictureFile) {
        try {
          const uploadUrl = await generateUploadUrl();
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": newPictureFile.type },
            body: newPictureFile,
          });

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          const result = await response.json();
          storageId = result.storageId;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to upload image";
          toast.error("Upload failed", { description: message });
          setIsSaving(false);
          return;
        }
      } else if (previewUrl === null && profile.picture) {
        storageId = null as unknown as typeof storageId;
      }

      await updateProfile({
        name: name.trim(),
        picture: storageId,
      });

      toast.success("Profile updated");

      if (!storageId) {
        setPreviewUrl(null);
      }
      setNewPictureFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error("Update failed", { description: message });
    } finally {
      setIsSaving(false);
    }
  };

  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  initializeForm();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information and picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewUrl || undefined} alt="Profile picture" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Change
                </Button>
                {previewUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSaving}
                    onClick={handleRemovePicture}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving || (!newPictureFile && name === profile.name && previewUrl === profile.picture)}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SigmaMemories />
    </div>
  );
}
