import { eq, and, desc } from "drizzle-orm";

import type { APIRoute } from "astro";

import { blogs } from "@/db/schema";
import { AuthService } from "@/lib/auth";
import { SessionCache } from "@/lib/session-cache";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals, url }) => {
  const token = AuthService.extractToken(request);
  const payload = token ? await AuthService.verifyToken(token) : null;

  if (!payload) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = (locals as any).db;
  const status = url.searchParams.get("status") || "all";

  // Super admin can see all blogs
  const isSuperAdmin = payload.userId === "super-admin";

  const userBlogs = await db
    .select()
    .from(blogs)
    .where(
      and(
        isSuperAdmin ? undefined : eq(blogs.userId, payload.userId),
        status !== "all" ? eq(blogs.status, status) : undefined,
      ) as any,
    )
    .orderBy(desc(blogs.updatedAt));

  return new Response(JSON.stringify({ blogs: userBlogs }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const token = AuthService.extractToken(request);
  const payload = token ? await AuthService.verifyToken(token) : null;

  if (!payload) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const { title, content, excerpt, status = "draft", tags } = body;

  if (!title || !content) {
    return new Response(
      JSON.stringify({ error: "Title and content are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const db = (locals as any).db;
  const blogId = crypto.randomUUID();
  const now = Date.now();

  // Generate slug from title
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  let slug = baseSlug;
  let counter = 1;

  // Ensure unique slug
  while (true) {
    const existing = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1);
    if (existing.length === 0) break;
    slug = `${baseSlug}-${counter++}`;
  }

  // Handle super admin - userId is nullable
  const isSuperAdmin = payload.userId === "super-admin";

  await db.insert(blogs).values({
    id: blogId,
    userId: isSuperAdmin ? null : payload.userId,
    title,
    slug,
    content: JSON.stringify(content),
    excerpt,
    status,
    tags: tags ? JSON.stringify(tags) : null,
    createdAt: now,
    updatedAt: now,
  });

  const newBlog = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, blogId))
    .limit(1);

  return new Response(JSON.stringify({ blog: newBlog[0] }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
