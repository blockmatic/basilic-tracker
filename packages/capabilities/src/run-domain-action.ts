import type { z } from "zod";

import type {
  DomainActionDefinition,
  DomainActionContext,
} from "./domain-action.js";
import type { MutationResult } from "./schemas.js";

export async function runDomainAction<
  TInput extends z.ZodType,
  TOutput extends z.ZodType,
>({
  action,
  ctx,
  input,
  revision,
}: {
  action: DomainActionDefinition<TInput, TOutput>;
  ctx: DomainActionContext;
  input: z.infer<TInput>;
  revision: number;
}): Promise<{
  mutation: MutationResult | null;
  output: z.infer<TOutput>;
}> {
  const parsed = action.inputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`invalid input for ${action.id}`);
  }
  const output = await action.execute(parsed.data, ctx);
  const outputParsed = action.outputSchema.safeParse(output);
  if (!outputParsed.success) {
    throw new Error(`invalid output for ${action.id}`);
  }
  const base =
    action.toMutation?.({
      input: parsed.data,
      operationId: ctx.operationId,
      output: outputParsed.data,
      userId: ctx.userId,
    }) ?? null;
  const mutation = base
    ? {
        ...base,
        revision,
        status: "applied" as const,
      }
    : null;
  return { mutation, output: outputParsed.data };
}
