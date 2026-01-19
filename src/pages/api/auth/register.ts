import { eq, or } from "drizzle-orm";
import { z } from "zod";

import type { APIRoute } from "astro";

import { users } from "@/db/schema";
import { AuthService } from "@/lib/auth";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z0-9_-]+$/),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { email, password, username, firstName, lastName } = validation.data;
    const db = (locals as any).db;

    // Check existing user
    const existing = await db
      .select()
      .from(users)
      .where(
        or(eq(users.email, email.toLowerCase()), eq(users.username, username)),
      )
      .limit(1);

    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create user
    const userId = crypto.randomUUID();
    const passwordHash = await AuthService.hashPassword(password);
    const now = Date.now();

    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      username,
      firstName,
      lastName,
      passwordHash,
      role: "viewer",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Generate token
    const token = await AuthService.generateToken(
      userId,
      email.toLowerCase(),
      "viewer",
    );

    return new Response(
      JSON.stringify({
        user: {
          id: userId,
          email,
          username,
          firstName,
          lastName,
          role: "viewer",
        },
        token,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": AuthService.getAuthCookie(token),
        },
      },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
