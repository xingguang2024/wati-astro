export interface CachedSession {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export class SessionCache {
  private static KV_TTL = 300; // 5 minutes

  // Cache session in KV for faster verification
  static async cacheSession(
    kv: import("@cloudflare/workers-types").KVNamespace,
    token: string,
    payload: CachedSession,
  ): Promise<void> {
    const key = `session:${token}`;
    await kv.put(key, JSON.stringify(payload), {
      expirationTtl: this.KV_TTL,
    });
  }

  // Get cached session
  static async getCachedSession(
    kv: import("@cloudflare/workers-types").KVNamespace,
    token: string,
  ): Promise<CachedSession | null> {
    const key = `session:${token}`;
    const cached = await kv.get(key, "json");
    return cached as CachedSession | null;
  }

  // Invalidate session (on logout)
  static async invalidateSession(
    kv: import("@cloudflare/workers-types").KVNamespace,
    token: string,
  ): Promise<void> {
    const key = `session:${token}`;
    await kv.delete(key);
  }
}
