import { eq } from "drizzle-orm";

import type { APIRoute } from "astro";

import { users } from "@/db/schema";
import { AuthService } from "@/lib/auth";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const token = AuthService.extractToken(request);
  if (!token) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = await AuthService.verifyToken(token);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = (locals as any).db;
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      avatar: users.avatar,
    })
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  if (user.length === 0) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ user: user[0] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
