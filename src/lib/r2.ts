/**
 * R2 Helper Utilities
 *
 * Provides helper functions for uploading, deleting, and managing files in Cloudflare R2.
 */

import type { R2Bucket } from '@cloudflare/workers-types';

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export interface UploadOptions {
  userId: string;
  maxSize?: number; // in bytes, default 10MB
  allowedTypes?: string[]; // MIME types, default allows common image and document types
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ALLOWED_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
];

/**
 * Generate a unique file key for R2 storage
 * Format: uploads/{userId}/{year}/{month}/{uuid}.{ext}
 */
export function generateUniqueKey(userId: string, filename: string): string {
  const ext = filename.split('.').pop() || 'bin';
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uuid = crypto.randomUUID();

  return `uploads/${userId}/${year}/${month}/${uuid}.${ext}`;
}

/**
 * Get public URL for a file in R2
 * Note: This assumes you have a custom domain or public bucket configured
 * For now, returns a relative path that can be used with a proxy or custom domain
 */
export function getFileUrl(key: string, customDomain?: string): string {
  if (customDomain) {
    return `https://${customDomain}/${key}`;
  }
  // Return relative path - you'll need to set up a proxy or custom domain
  return `/uploads/${key}`;
}

/**
 * Validate file before upload
 */
function validateFile(
  file: File,
  options: UploadOptions
): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || DEFAULT_MAX_SIZE;
  const allowedTypes = options.allowedTypes || DEFAULT_ALLOWED_TYPES;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Upload a file to R2
 */
export async function uploadFile(
  r2: R2Bucket,
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  // Validate file
  const validation = validateFile(file, options);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Generate unique key
  const key = generateUniqueKey(options.userId, file.name);

  // Convert file to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Upload to R2
  await r2.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      userId: options.userId,
    },
  });

  // Return result
  return {
    key,
    url: getFileUrl(key),
    size: file.size,
    contentType: file.type,
  };
}

/**
 * Delete a file from R2
 */
export async function deleteFile(r2: R2Bucket, key: string): Promise<void> {
  await r2.delete(key);
}

/**
 * Check if a file exists in R2
 */
export async function fileExists(r2: R2Bucket, key: string): Promise<boolean> {
  const object = await r2.head(key);
  return object !== null;
}

/**
 * Get file metadata from R2
 */
export async function getFileMetadata(
  r2: R2Bucket,
  key: string
): Promise<{
  size: number;
  uploaded: Date;
  contentType?: string;
} | null> {
  const object = await r2.head(key);
  if (!object) {
    return null;
  }

  return {
    size: object.size,
    uploaded: object.uploaded,
    contentType: object.httpMetadata?.contentType,
  };
}

/**
 * List files in R2 with optional prefix
 */
export async function listFiles(
  r2: R2Bucket,
  prefix?: string,
  limit?: number
): Promise<Array<{ key: string; size: number; uploaded: Date }>> {
  const listed = await r2.list({
    prefix,
    limit,
  });

  return listed.objects.map((obj) => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded,
  }));
}

/**
 * Delete multiple files from R2
 */
export async function deleteFiles(r2: R2Bucket, keys: string[]): Promise<void> {
  await r2.delete(keys);
}
