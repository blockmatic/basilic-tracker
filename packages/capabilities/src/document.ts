import { z } from "zod";

/** Product-gated: wire to a rich editor surface when the app defines document storage. */
export const documentOpSchema = z.discriminatedUnion("kind", [
  z.object({
    baseRevision: z.number().int().nonnegative(),
    content: z.string(),
    kind: z.literal("replace"),
  }),
  z.object({
    baseRevision: z.number().int().nonnegative(),
    kind: z.literal("patch"),
    ops: z.array(
      z.object({
        path: z.string(),
        value: z.unknown(),
      })
    ),
  }),
]);

export type DocumentOp = z.infer<typeof documentOpSchema>;
