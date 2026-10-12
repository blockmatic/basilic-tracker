import type { z } from "zod";

import type { DomainActionDefinition } from "./domain-action.js";

export interface CapabilityMeta {
  id: string;
  kind: "domain" | "ui";
  scope: "public" | "user";
}

export type DomainRegistry = Record<
  string,
  DomainActionDefinition<z.ZodType, z.ZodType>
>;

export function createDomainRegistry(
  actions: DomainActionDefinition<z.ZodType, z.ZodType>[]
): DomainRegistry {
  return Object.fromEntries(actions.map((action) => [action.id, action]));
}

export function listCapabilityMeta({
  registry,
}: {
  registry: DomainRegistry;
}): CapabilityMeta[] {
  return Object.values(registry).map((action) => ({
    id: action.id,
    kind: "domain",
    scope: "user",
  }));
}

export function findUncoveredHttpMutations({
  registry,
  requiredOperationIds,
}: {
  registry: DomainRegistry;
  requiredOperationIds: readonly string[];
}): string[] {
  const covered = new Set(
    Object.values(registry)
      .map((action) => action.httpOperationId)
      .filter((id): id is string => Boolean(id))
  );
  return requiredOperationIds.filter(
    (operationId) => !covered.has(operationId)
  );
}
