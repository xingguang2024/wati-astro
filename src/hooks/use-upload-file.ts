import { generateReactHelpers } from "@uploadthing/react";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import type { OurFileRouter } from "@/lib/uploadthing";
import type {
  ClientUploadedFileData,
  UploadFilesOptions,
} from "uploadthing/types";

export type UploadedFile<T = unknown> = ClientUploadedFileData<T>;

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter["editorUploader"]>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
  useR2?: boolean; // Use R2 upload instead of UploadThing
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
  useR2 = false,
  ...props
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      if (useR2) {
        return await uploadToR2(file);
      } else {
        return await uploadToUploadThing(file);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      const message =
        errorMessage.length > 0
          ? errorMessage
          : "Something went wrong, please try again later.";

      toast.error(message);

      onUploadError?.(error);

      // Mock upload for unauthenticated users
      const mockUploadedFile = {
        key: "mock-key-0",
        appUrl: `https://mock-app-url.com/${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      } as UploadedFile;

      // Simulate upload progress
      let mockProgress = 0;

      const simulateProgress = async () => {
        while (mockProgress < 100) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          mockProgress += 2;
          setProgress(Math.min(mockProgress, 100));
        }
      };

      await simulateProgress();

      setUploadedFile(mockUploadedFile);

      return mockUploadedFile;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  async function uploadToR2(file: File): Promise<UploadedFile> {
    // Simulate progress for better UX
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress <= 90) {
        setProgress(currentProgress);
      }
    }, 100);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    clearInterval(progressInterval);
    setProgress(100);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const result = await response.json();
    const uploadedFileData: UploadedFile = {
      key: result.file.key,
      appUrl: result.file.url,
      url: result.file.url,
      name: result.file.name,
      size: result.file.size,
    } as UploadedFile;

    setUploadedFile(uploadedFileData);
    onUploadComplete?.(uploadedFileData);

    return uploadedFileData;
  }

  async function uploadToUploadThing(file: File): Promise<UploadedFile> {
    const res = await uploadFiles("editorUploader", {
      ...props,
      files: [file],
      onUploadProgress: ({ progress: uploadProgress }) => {
        setProgress(Math.min(uploadProgress, 100));
      },
    });

    setUploadedFile(res[0]);
    onUploadComplete?.(res[0]);

    return res[0];
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile,
    uploadingFile,
  };
}

export const { uploadFiles, useUploadThing } =
  generateReactHelpers<OurFileRouter>();

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message);

    return errors.join("\n");
  }
  if (err instanceof Error) {
    return err.message;
  }
  return unknownError;
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
