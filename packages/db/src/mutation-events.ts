import { and, eq, gt } from "drizzle-orm";

import { getDb } from "./client.js";
import { mutationEvents } from "./schema/index.js";
import type { MutationEventRow } from "./schema/tables/mutation-events.js";

export async function findMutationByOperationId({
  operationId,
}: {
  operationId: string;
}): Promise<MutationEventRow | null> {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(mutationEvents)
    .where(eq(mutationEvents.operationId, operationId))
    .limit(1);
  return row ?? null;
}

export async function appendMutationEvent({
  capabilityId,
  entities,
  operationId,
  payload,
  queryKeys,
  revision,
  userId,
}: {
  capabilityId: string;
  entities: { id: string; type: string }[];
  operationId: string;
  payload?: Record<string, unknown>;
  queryKeys: unknown[][];
  revision: string;
  userId: string;
}): Promise<MutationEventRow> {
  const db = await getDb();
  const [row] = await db
    .insert(mutationEvents)
    .values({
      capabilityId,
      entities,
      operationId,
      payload,
      queryKeys,
      revision,
      userId,
    })
    .returning();
  if (!row) {
    throw new Error("mutation event insert failed");
  }
  return row;
}

export async function listMutationEventsAfter({
  after,
  limit,
  userId,
}: {
  after: number;
  limit: number;
  userId: string;
}): Promise<MutationEventRow[]> {
  const db = await getDb();
  return db
    .select()
    .from(mutationEvents)
    .where(
      and(eq(mutationEvents.userId, userId), gt(mutationEvents.cursor, after))
    )
    .orderBy(mutationEvents.cursor)
    .limit(limit);
}
