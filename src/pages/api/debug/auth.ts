import type { APIRoute } from "astro";

import { AuthService } from "@/lib/auth";

export const prerender = false;

/**
 * Debug endpoint to check authentication status
 * Remove this in production!
 */
export const GET: APIRoute = async ({ request }) => {
  // Get token from various sources
  const authHeader = request.headers.get("Authorization");
  const cookieHeader = request.headers.get("Cookie");

  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const tokenFromCookie =
    cookieHeader?.match(/auth_token=([^;]+)/)?.[1] || null;

  const result: any = {
    authHeader: authHeader || null,
    cookieHeader: cookieHeader ? "***cookie exists***" : null,
    tokenFromHeader: tokenFromHeader ? "***" : null,
    tokenFromCookie: tokenFromCookie ? "***" : null,
    jwtSecretSet: !!import.meta.env.JWT_SECRET,
    jwtSecretLength: import.meta.env.JWT_SECRET?.length || 0,
    adminEmailSet: !!import.meta.env.ADMIN_EMAIL,
    adminPasswordSet: !!import.meta.env.ADMIN_PASSWORD,
  };

  // Try to verify the token
  const token = tokenFromHeader || tokenFromCookie;
  if (token) {
    try {
      const payload = await AuthService.verifyToken(token);
      result.tokenValid = true;
      result.payload = payload;
    } catch (error) {
      result.tokenValid = false;
      result.error = error instanceof Error ? error.message : String(error);
    }
  } else {
    result.tokenValid = false;
    result.error = "No token found";
  }

  return new Response(JSON.stringify(result, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
