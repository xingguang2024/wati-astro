type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    db?: ReturnType<typeof import('./db').createDB>
    kv?: import('@cloudflare/workers-types').KVNamespace
    r2?: import('@cloudflare/workers-types').R2Bucket
  }
}

interface ImportMetaEnv {
  readonly JWT_SECRET?: string;
  readonly AI_GATEWAY_API_KEY?: string;
  readonly OPENAI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
