import { unwatchAsset, watchAsset } from "@repo/db";
import { z } from "zod";

import { defineDomainAction } from "../domain-action.js";
import { createDomainRegistry } from "../registry.js";

const watchOutputSchema = z.object({
  assetId: z.string(),
  error: z.enum(["limit", "not_found"]).optional(),
  watchId: z.string().optional(),
});

export const watchAssetCapability = defineDomainAction({
  execute: async ({ assetId }, ctx) => {
    const { watch, error } = await watchAsset({
      assetId,
      userId: ctx.userId,
    });
    if (error === "not_found") {
      return { assetId, error: "not_found" as const };
    }
    if (error === "limit") {
      return { assetId, error: "limit" as const };
    }
    return { assetId, watchId: watch?.id };
  },
  httpOperationId: "putCoinWatch",
  id: "watch_asset",
  idempotent: true,
  inputSchema: z.object({ assetId: z.string().min(1) }),
  outputSchema: watchOutputSchema,
  queryKeys: () => [["coins", "watches"]],
  toMutation: ({ input, output, operationId }) => {
    if (output.error) {
      return null;
    }
    return {
      capabilityId: "watch_asset",
      entities: [{ id: input.assetId, type: "asset" }],
      operationId,
      queryKeys: [
        ["coins", "watches"],
        ["coins", "list"],
      ],
    };
  },
});

export const unwatchAssetCapability = defineDomainAction({
  execute: async ({ assetId }, ctx) => {
    await unwatchAsset({ assetId, userId: ctx.userId });
    return { assetId, removed: true };
  },
  httpOperationId: "deleteCoinWatchById",
  id: "unwatch_asset",
  idempotent: true,
  inputSchema: z.object({ assetId: z.string().min(1) }),
  outputSchema: z.object({ assetId: z.string(), removed: z.boolean() }),
  queryKeys: () => [["coins", "watches"]],
  toMutation: ({ input, operationId }) => ({
    capabilityId: "unwatch_asset",
    entities: [{ id: input.assetId, type: "asset" }],
    operationId,
    queryKeys: [
      ["coins", "watches"],
      ["coins", "list"],
    ],
  }),
});

export const trackerDomainRegistry = createDomainRegistry([
  watchAssetCapability,
  unwatchAssetCapability,
]);
