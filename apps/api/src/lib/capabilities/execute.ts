import {
  runDomainAction,
  type DomainRegistry,
  type MutationResult,
} from "@repo/capabilities";
import { appendMutationEvent, findMutationByOperationId } from "@repo/db";

export async function executeDomainCapability({
  capabilityId,
  input,
  operationId,
  registry,
  userId,
}: {
  capabilityId: string;
  input: unknown;
  operationId: string;
  registry: DomainRegistry;
  userId: string;
}): Promise<{ mutation: MutationResult | null; output: unknown }> {
  const existing = await findMutationByOperationId({ operationId });
  if (existing) {
    return {
      mutation: {
        capabilityId: existing.capabilityId,
        entities: existing.entities,
        operationId: existing.operationId,
        queryKeys: existing.queryKeys,
        revision: existing.cursor,
        status: "replayed",
      },
      output: existing.payload ?? null,
    };
  }
  const action = registry[capabilityId];
  if (!action) {
    throw new Error(`unknown capability ${capabilityId}`);
  }
  const { mutation, output } = await runDomainAction({
    action,
    ctx: { operationId, userId },
    input,
    revision: 0,
  });
  if (!mutation) {
    return { mutation: null, output };
  }
  const row = await appendMutationEvent({
    capabilityId: mutation.capabilityId,
    entities: mutation.entities,
    operationId: mutation.operationId,
    payload: output as Record<string, unknown>,
    queryKeys: mutation.queryKeys,
    revision: String(mutation.revision),
    userId,
  });
  return {
    mutation: { ...mutation, revision: row.cursor, status: "applied" },
    output,
  };
}
