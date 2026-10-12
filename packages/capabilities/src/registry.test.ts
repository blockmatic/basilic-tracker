import { describe, expect, it } from "vitest";
import { z } from "zod";

import { defineDomainAction } from "./domain-action.js";
import {
  createDomainRegistry,
  findUncoveredHttpMutations,
} from "./registry.js";

describe("findUncoveredHttpMutations", () => {
  it("flags operations without a capability adapter", () => {
    const registry = createDomainRegistry([
      defineDomainAction({
        execute: async () => ({ ok: true }),
        httpOperationId: "putCoinWatch",
        id: "watch_asset",
        idempotent: true,
        inputSchema: z.object({ assetId: z.string() }),
        outputSchema: z.object({ ok: z.boolean() }),
        queryKeys: () => [["coins", "watches"]],
      }),
    ]);
    expect(
      findUncoveredHttpMutations({
        registry,
        requiredOperationIds: ["putCoinWatch", "deleteCoinWatchById"],
      })
    ).toEqual(["deleteCoinWatchById"]);
  });
});
