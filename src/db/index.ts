import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export function createDB(d1: import("@cloudflare/workers-types").D1Database) {
  return drizzle(d1, { schema });
}

// Type for Astro context with DB, KV, and R2
export interface Env {
  DB: import("@cloudflare/workers-types").D1Database;
  KV: import("@cloudflare/workers-types").KVNamespace;
  R2: import("@cloudflare/workers-types").R2Bucket;
}
