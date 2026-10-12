import {
  bigserial,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const mutationEvents = pgTable(
  "mutation_events",
  {
    capabilityId: text("capability_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    cursor: bigserial("cursor", { mode: "number" }).primaryKey(),
    entities: jsonb("entities")
      .notNull()
      .$type<{ id: string; type: string }[]>(),
    operationId: text("operation_id").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    queryKeys: jsonb("query_keys").notNull().$type<unknown[][]>(),
    revision: text("revision").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("mutation_events_operation_id_unique").on(table.operationId),
    index("mutation_events_user_cursor_idx").on(table.userId, table.cursor),
  ]
);

export type MutationEventRow = typeof mutationEvents.$inferSelect;
