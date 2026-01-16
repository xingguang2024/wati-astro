/**
 * File Upload API Route
 *
 * POST /api/upload
 *
 * Handles file uploads to Cloudflare R2 bucket.
 * Requires authentication via JWT token.
 */

import type { APIRoute } from 'astro';

import { AuthService } from '@/lib/auth';
import { uploadFile } from '@/lib/r2';

export const prerender = false;

const ALLOWED_TYPES = [
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

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Verify authentication
    const token = AuthService.extractToken(request);
    const payload = token ? await AuthService.verifyToken(token) : null;

    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get R2 bucket from locals
    const r2 = (locals as any).r2;
    if (!r2) {
      return new Response(
        JSON.stringify({ error: 'R2 storage not available' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Upload file to R2
    const result = await uploadFile(r2, file, {
      userId: payload.userId,
      maxSize: MAX_SIZE,
      allowedTypes: ALLOWED_TYPES,
    });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        file: {
          key: result.key,
          url: result.url,
          size: result.size,
          contentType: result.contentType,
          name: file.name,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Cache control for uploaded files
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);

    // Handle validation errors
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Handle unexpected errors
    return new Response(
      JSON.stringify({ error: 'Failed to upload file' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// OPTIONS endpoint for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
