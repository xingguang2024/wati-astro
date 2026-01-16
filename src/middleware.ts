import { defineMiddleware } from 'astro:middleware'
import { createDB } from './db'

export const onRequest = defineMiddleware(async (context, next) => {
  // Initialize DB, KV, and R2 in locals
  const env = context.locals.runtime?.env
  if (env?.DB) {
    context.locals.db = createDB(env.DB)
  }
  if (env?.KV) {
    context.locals.kv = env.KV
  }
  if (env?.R2) {
    context.locals.r2 = env.R2
  }

  return next()
})
