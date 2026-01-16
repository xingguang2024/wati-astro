import type { APIRoute } from "astro";

import { AuthService } from "@/lib/auth";
import { SessionCache } from "@/lib/session-cache";


export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const token = AuthService.extractToken(request);
  const kv = (locals as any).runtime?.env
    .KV as import("@cloudflare/workers-types").KVNamespace;

  // Invalidate KV cache
  if (token && kv) {
    await SessionCache.invalidateSession(kv, token);
  }

  const response = new Response(
    JSON.stringify({ message: "Logged out successfully" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );

  AuthService.clearAuthCookie(response);
  return response;
};
