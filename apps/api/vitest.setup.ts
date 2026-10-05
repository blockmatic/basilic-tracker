/**
 * Vitest per-file setup. Database lifecycle is owned by each group entry `.spec.ts`
 * via `test/utils/db-setup.ts` (truncate between groups; PGLite stays open per worker).
 *
 * Remote AI tests run when ANTHROPIC_API_KEY is a real secret.
 * Live Jev tests run when AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN is set.
 */

await import("./src/lib/markets-host.js");
