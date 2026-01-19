import { eq, and } from "drizzle-orm";

import type { APIRoute } from "astro";

import { blogs } from "@/db/schema";
import { AuthService } from "@/lib/auth";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals, params }) => {
  const token = AuthService.extractToken(request);
  const payload = token ? await AuthService.verifyToken(token) : null;

  if (!payload) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!params.id) {
    return new Response(JSON.stringify({ error: "Blog ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const blogId = params.id;
  const db = (locals as any).db;
  const blog = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.id, blogId), eq(blogs.userId, payload.userId)))
    .limit(1);

  if (blog.length === 0) {
    return new Response(JSON.stringify({ error: "Blog not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ blog: blog[0] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request, locals, params }) => {
  const token = AuthService.extractToken(request);
  const payload = token ? await AuthService.verifyToken(token) : null;

  if (!payload) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!params.id) {
    return new Response(JSON.stringify({ error: "Blog ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const blogId = params.id;
  const body = await request.json();
  const { title, content, excerpt, status, tags, coverImage } = body;

  const db = (locals as any).db;
  const existing = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.id, blogId), eq(blogs.userId, payload.userId)))
    .limit(1);

  if (existing.length === 0) {
    return new Response(JSON.stringify({ error: "Blog not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const updateData: any = {
    updatedAt: Date.now(),
  };

  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = JSON.stringify(content);
  if (excerpt !== undefined) updateData.excerpt = excerpt;
  if (status !== undefined) {
    updateData.status = status;
    if (status === "published" && !existing[0].publishedAt) {
      updateData.publishedAt = Date.now();
    }
  }
  if (tags !== undefined) updateData.tags = tags ? JSON.stringify(tags) : null;
  if (coverImage !== undefined) updateData.coverImage = coverImage;

  await db.update(blogs).set(updateData).where(eq(blogs.id, blogId));

  const updated = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, blogId))
    .limit(1);

  return new Response(JSON.stringify({ blog: updated[0] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ request, locals, params }) => {
  const token = AuthService.extractToken(request);
  const payload = token ? await AuthService.verifyToken(token) : null;

  if (!payload) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!params.id) {
    return new Response(JSON.stringify({ error: "Blog ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const blogId = params.id;
  const db = (locals as any).db;
  await db
    .delete(blogs)
    .where(and(eq(blogs.id, blogId), eq(blogs.userId, payload.userId)));

  return new Response(JSON.stringify({ message: "Blog deleted" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
