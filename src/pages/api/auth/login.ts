import { eq, and } from "drizzle-orm";
import { z } from "zod";

import type { APIRoute } from "astro";

import { users } from "@/db/schema";
import { AuthService } from "@/lib/auth";
import { SessionCache } from "@/lib/session-cache";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify({ error: "Validation failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { email, password } = validation.data;
    const db = (locals as any).db;
    const kv = (locals as any).runtime?.env
      .KV as import("@cloudflare/workers-types").KVNamespace;

    // ============================================
    // STEP 1: Check Super Admin from Environment Variables
    // ============================================
    const adminEmail = import.meta.env.ADMIN_EMAIL?.toLowerCase();
    const adminPassword = import.meta.env.ADMIN_PASSWORD;

    // If environment variables are set and credentials match, authenticate as super admin
    if (adminEmail && adminPassword && email.toLowerCase() === adminEmail && password === adminPassword) {
      // Super admin authenticated from environment variables
      const adminId = "super-admin"; // Fixed ID for super admin
      const adminUsername = import.meta.env.ADMIN_USERNAME || "admin";
      const adminFirstName = import.meta.env.ADMIN_FIRST_NAME || "Super";
      const adminLastName = import.meta.env.ADMIN_LAST_NAME || "Admin";

      // Generate token
      const token = await AuthService.generateToken(
        adminId,
        adminEmail,
        "admin",
      );

      // Cache session in KV (if available)
      if (kv) {
        await SessionCache.cacheSession(kv, token, {
          userId: adminId,
          email: adminEmail,
          role: "admin",
          exp: Math.floor(Date.now() / 1000) + 86400,
        });
      }

      const response = new Response(
        JSON.stringify({
          user: {
            id: adminId,
            email: adminEmail,
            username: adminUsername,
            firstName: adminFirstName,
            lastName: adminLastName,
            role: "admin",
          },
          token,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": AuthService.getAuthCookie(token),
          },
        },
      );

      return response;
    }

    // ============================================
    // STEP 2: Check Regular User from Database
    // ============================================
    const user = await db
      .select()
      .from(users)
      .where(
        and(eq(users.email, email.toLowerCase()), eq(users.isActive, true)),
      )
      .limit(1);

    if (user.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify password
    const isValid = await AuthService.verifyPassword(
      password,
      user[0].passwordHash,
    );
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update last login
    await db
      .update(users)
      .set({
        lastLoginAt: Date.now(),
        updatedAt: Date.now(),
      })
      .where(eq(users.id, user[0].id));

    // Generate token
    const token = await AuthService.generateToken(
      user[0].id,
      user[0].email,
      user[0].role,
    );

    // Cache session in KV (if available)
    if (kv) {
      await SessionCache.cacheSession(kv, token, {
        userId: user[0].id,
        email: user[0].email,
        role: user[0].role,
        exp: Math.floor(Date.now() / 1000) + 86400,
      });
    }

    const response = new Response(
      JSON.stringify({
        user: {
          id: user[0].id,
          email: user[0].email,
          username: user[0].username,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          role: user[0].role,
        },
        token,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": AuthService.getAuthCookie(token),
        },
      },
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
