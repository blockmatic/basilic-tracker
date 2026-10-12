import type { z } from "zod";

import type { MutationResult } from "./schemas.js";

export interface DomainActionContext {
  operationId: string;
  userId: string;
}

export interface DomainActionDefinition<
  TInput extends z.ZodType,
  TOutput extends z.ZodType,
> {
  execute: (
    input: z.infer<TInput>,
    ctx: DomainActionContext
  ) => Promise<z.infer<TOutput>>;
  id: string;
  idempotent: boolean;
  inputSchema: TInput;
  outputSchema: TOutput;
  queryKeys: (
    input: z.infer<TInput>,
    output: z.infer<TOutput>
  ) => readonly (readonly unknown[])[];
  httpOperationId?: string;
  toMutation?: (input: {
    input: z.infer<TInput>;
    output: z.infer<TOutput>;
    operationId: string;
    userId: string;
  }) => Omit<MutationResult, "status" | "revision"> | null;
}

export function defineDomainAction<
  TInput extends z.ZodType,
  TOutput extends z.ZodType,
>(def: DomainActionDefinition<TInput, TOutput>) {
  return def;
}
