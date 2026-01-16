/**
 * Custom R2 Upload Hook
 *
 * Provides file upload functionality using Cloudflare R2 instead of UploadThing.
 */

import * as React from 'react';
import { toast } from 'sonner';

export interface UploadedFile {
  key: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

interface UseUploadR2Props {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadR2({
  onUploadComplete,
  onUploadError,
}: UseUploadR2Props = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadFile(file: File): Promise<UploadedFile | undefined> {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX (real progress requires XHR or fetch with ReadableStream)
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        if (currentProgress <= 90) {
          setProgress(currentProgress);
        }
      }, 100);

      // Upload to R2 API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        // Note: Authentication is handled via cookies by AuthService
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
        url: result.file.url,
        name: result.file.name,
        size: result.file.size,
        type: result.file.contentType,
      };

      setUploadedFile(uploadedFileData);
      onUploadComplete?.(uploadedFileData);

      toast.success('File uploaded successfully');

      return uploadedFileData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);

      onUploadError?.(error);
      return undefined;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile,
    uploadingFile,
  };
}
