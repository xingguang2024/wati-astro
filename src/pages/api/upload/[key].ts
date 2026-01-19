/**
 * File Delete API Route
 *
 * DELETE /api/upload/[key]
 *
 * Handles file deletion from Cloudflare R2 bucket.
 * Requires authentication and validates file ownership.
 */

import type { APIRoute } from "astro";

import { AuthService } from "@/lib/auth";
import { deleteFile, getFileMetadata } from "@/lib/r2";

export const prerender = false;

export const DELETE: APIRoute = async ({ request, locals, params }) => {
  try {
    // Verify authentication
    const token = AuthService.extractToken(request);
    const payload = token ? await AuthService.verifyToken(token) : null;

    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Get file key from params
    const { key } = params;
    if (!key) {
      return new Response(JSON.stringify({ error: "File key is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get R2 bucket from locals
    const r2 = (locals as any).r2;
    if (!r2) {
      return new Response(
        JSON.stringify({ error: "R2 storage not available" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Validate file ownership by checking metadata
    const metadata = await getFileMetadata(r2, key);
    if (!metadata) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if file belongs to user (files are stored under uploads/{userId}/...)
    const expectedPrefix = `uploads/${payload.userId}/`;
    if (!key.startsWith(expectedPrefix)) {
      return new Response(
        JSON.stringify({
          error: "You do not have permission to delete this file",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Delete file from R2
    await deleteFile(r2, key);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "File deleted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Delete error:", error);

    return new Response(JSON.stringify({ error: "Failed to delete file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// OPTIONS endpoint for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
