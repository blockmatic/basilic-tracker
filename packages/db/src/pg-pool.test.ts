import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { pgPoolConfig } from "./pg-pool.js";

const connectionString =
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

describe("pgPoolConfig", () => {
  it("leaves ssl unset when vercel is omitted or false", () => {
    expect(pgPoolConfig({ connectionString })).toEqual({ connectionString });
    expect(pgPoolConfig({ connectionString, vercel: false })).toEqual({
      connectionString,
    });
  });

  it("skips certificate verification on Vercel", () => {
    expect(pgPoolConfig({ connectionString, vercel: true })).toEqual({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  });

  it("strips sslmode from the URL on Vercel so pg does not override ssl", () => {
    const marketplaceUrl =
      "postgresql://user:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require";
    const config = pgPoolConfig({
      connectionString: marketplaceUrl,
      vercel: true,
    });
    expect(config.connectionString).not.toContain("sslmode=");
    const client = new Client(config);
    expect(client.connectionParameters.ssl).toEqual({
      rejectUnauthorized: false,
    });
  });

  it("keeps an explicit ssl option", () => {
    expect(
      pgPoolConfig({
        connectionString,
        vercel: true,
        ssl: { rejectUnauthorized: true },
      })
    ).toEqual({ connectionString, ssl: { rejectUnauthorized: true } });
  });
});
