type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    db?: any;
    kv?: import('@cloudflare/workers-types').KVNamespace
    r2?: import('@cloudflare/workers-types').R2Bucket
  }
}

interface ImportMetaEnv {
  readonly JWT_SECRET?: string;
  readonly AI_GATEWAY_API_KEY?: string;
  readonly OPENAI_API_KEY?: string;
  readonly GOOGLE_API_KEY?: string;

  // Super Admin Account (auto-created on first deploy)
  readonly ADMIN_EMAIL?: string;
  readonly ADMIN_PASSWORD?: string;
  readonly ADMIN_USERNAME?: string;
  readonly ADMIN_FIRST_NAME?: string;
  readonly ADMIN_LAST_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
