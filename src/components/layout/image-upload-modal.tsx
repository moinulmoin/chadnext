import { useDropzone } from "@uploadthing/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "~/hooks/use-toast";
import { useUploadThing } from "~/lib/client/uploadthing";
import Icons from "../shared/icons";
import { Button } from "../ui/button";

export default function ImageUploadModal({
  onImageChange,
}: {
  onImageChange: (imageUrl: string) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setFiles(acceptedFiles);
    setPreview(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  const { startUpload, isUploading, routeConfig } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (res) => {
        if (res) {
          onImageChange(res[0].url);
          toast({
            title: "Uploaded successfully!",
          });
          setShowModal(false);
        }
      },
      onUploadError: (e) => {
        console.log(e);
        toast({
          title: "Error occurred while uploading!",
          variant: "destructive",
        });
      },
    }
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  const handleCancel = useCallback(() => {
    if (preview) {
      setFiles([]);
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [preview]);

  useEffect(() => {
    if (!showModal) {
      handleCancel();
    }
  }, [handleCancel, showModal]);

  const handleUpload = () => {
    startUpload(files);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <div className="absolute left-0 top-0 flex h-28 w-28 cursor-pointer items-center justify-center rounded-full bg-primary/40 text-white opacity-0 group-hover:opacity-100 dark:bg-secondary/40">
          <Button
            type="button"
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
          <DialogTitle>Image Upload</DialogTitle>
        </DialogHeader>
        <div>
          {preview ? (
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-40 w-40">
                <Image
                  src={preview}
                  alt="File preview"
                  className="rounded-full"
                  fill
                  loading="lazy"
                />
              </div>
              <div className="mt-10">
                <Button
                  disabled={isUploading}
                  onClick={handleCancel}
                  className="mr-10 text-destructive hover:text-destructive"
                  variant="outline"
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
              className="flex h-60 items-center justify-center border border-dashed focus-visible:outline-none"
              {...getRootProps()}
            >
              <input className="" {...getInputProps()} />
              <div className="space-y-2 text-center">
                <div className="flex cursor-pointer flex-col items-center gap-y-2">
                  <Icons.download size={40} />
                </div>
                <p className="text-sm">
                  Drop <em>or</em> Click Here
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <div className="text-right text-xs leading-normal">
            <p>
              <span className="text-sm text-destructive">*</span>
              {`Only Image files are supported and size limit up to ${routeConfig?.image?.maxFileSize}.`}
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
