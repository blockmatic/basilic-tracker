import { Pool } from "pg";
import type { PoolConfig } from "pg";

type PgPoolInput = PoolConfig & { vercel?: boolean };

/** `pg` merges parsed connection-string sslmode over explicit `ssl`; drop it on Vercel. */
function connectionStringWithoutSslmode(connectionString: string) {
  const url = new URL(connectionString);
  url.searchParams.delete("sslmode");
  return url.toString();
}

/** Vercel Postgres often presents a private CA; Node 24 + pg treat sslmode=require as verify-full. */
export function pgPoolConfig({
  vercel = false,
  ssl,
  connectionString,
  ...config
}: PgPoolInput): PoolConfig {
  if (ssl !== undefined) {
    return {
      ...config,
      ...(connectionString !== undefined ? { connectionString } : {}),
      ssl,
    };
  }
  if (!vercel) {
    return {
      ...config,
      ...(connectionString !== undefined ? { connectionString } : {}),
    };
  }
  const resolvedConnectionString =
    typeof connectionString === "string"
      ? connectionStringWithoutSslmode(connectionString)
      : connectionString;
  return {
    ...config,
    ...(resolvedConnectionString !== undefined
      ? { connectionString: resolvedConnectionString }
      : {}),
    ssl: { rejectUnauthorized: false },
  };
}

export function createPgPool(input: PgPoolInput): Pool {
  return new Pool(pgPoolConfig(input));
}
