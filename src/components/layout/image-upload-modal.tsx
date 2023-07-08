/* eslint-disable @next/next/no-img-element */
"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useUploadThing } from "~/lib/uploadthing";
import Icons from "../shared/icons";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const fileTypes = ["image"];

export default function ImageUploadModal() {
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
    setPreview(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles: 1,
    multiple: false,
  });

  const { startUpload } = useUploadThing({
    endpoint: "imageUploader",
    onClientUploadComplete: () => {
      setIsUploading(false);
      router.refresh();
      toast({
        title: "Image Updated successfully!",
      });
      setShowModal(false);
    },
    onUploadError: () => {
      setIsUploading(false);
      toast({
        title: "Error occurred while updating!",
        variant: "destructive",
      });
    },
  });

  const handleCancel = useCallback(() => {
    setFiles([]);
    URL.revokeObjectURL(preview as string);
    setPreview(null);
  }, [preview]);

  useEffect(() => {
    if (!showModal) {
      handleCancel();
    }
  }, [handleCancel, showModal]);

  const handleUpload = () => {
    setIsUploading(true);
    startUpload(files);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <div className="absolute left-0 top-0 flex h-28 w-28 cursor-pointer items-center justify-center rounded-full bg-primary/40 text-white opacity-0 group-hover:opacity-100 dark:bg-secondary/40">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs hover:bg-transparent hover:text-white"
          >
            <Icons.edit className="mr-1 h-3 w-3" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Upload</DialogTitle>
        </DialogHeader>
        <div>
          {preview ? (
            <div className=" flex flex-col items-center justify-center">
              <div className=" h-40 w-40 ">
                <img
                  src={preview}
                  alt="File preview"
                  className="h-full w-full rounded-full"
                  loading="lazy"
                />
              </div>
              <div className=" mt-10">
                <Button
                  disabled={isUploading}
                  onClick={handleCancel}
                  className=" mr-2 text-destructive"
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button disabled={isUploading} onClick={handleUpload}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className=" flex h-60 items-center justify-center border border-dashed "
              {...getRootProps()}
            >
              <input className="" {...getInputProps()} />
              <div className=" space-y-2 text-center">
                <div className="flex cursor-pointer flex-col items-center gap-y-2">
                  <span className=" text-sm">Drop Here</span>
                  <Icons.download size={40} />
                </div>
                <p className=" text-muted-foreground">OR</p>
                <p className=" cursor-pointer text-sm">Click here</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <p className=" text-xs">
            Only images are supported. Max file size is 4MB.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
