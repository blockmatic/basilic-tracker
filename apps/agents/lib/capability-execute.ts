import { runDomainAction, type DomainRegistry } from "@repo/capabilities";
import { appendMutationEvent, findMutationByOperationId } from "@repo/db";

import { domainRegistry } from "./domain-registry.js";

export async function runCapabilityForPrincipal({
  capabilityId,
  input,
  operationId,
  userId,
}: {
  capabilityId: string;
  input: unknown;
  operationId: string;
  userId: string;
}) {
  const registry: DomainRegistry = domainRegistry;
  const existing = await findMutationByOperationId({ operationId });
  if (existing) {
    return { output: existing.payload, replayed: true };
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
  if (mutation) {
    await appendMutationEvent({
      capabilityId: mutation.capabilityId,
      entities: mutation.entities,
      operationId: mutation.operationId,
      payload: output as Record<string, unknown>,
      queryKeys: mutation.queryKeys,
      revision: String(mutation.revision),
      userId,
    });
  }
  return { output, replayed: false };
}
