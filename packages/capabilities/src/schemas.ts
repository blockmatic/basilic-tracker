import type { Spec } from "@json-render/core";
import { viewConfigSchema } from "@repo/utils/view-config";
import { z } from "zod";
// Tracker board uses the full view-config schema from @repo/utils

export const capabilityKindValues = ["domain", "ui"] as const;
export const capabilityScopeValues = ["public", "user"] as const;

export const entityRefSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
});

export const mutationStatusValues = [
  "applied",
  "replayed",
  "rejected",
] as const;

export const mutationResultSchema = z.object({
  capabilityId: z.string().min(1),
  entities: z.array(entityRefSchema),
  error: z
    .object({
      code: z.string().min(1),
      retryable: z.boolean(),
    })
    .optional(),
  operationId: z.string().min(1),
  queryKeys: z.array(z.array(z.unknown())),
  revision: z.number().int().nonnegative(),
  status: z.enum(mutationStatusValues),
});

export type MutationResult = z.infer<typeof mutationResultSchema>;

export const mutationEventSchema = z.object({
  capabilityId: z.string().min(1),
  createdAt: z.string().datetime(),
  cursor: z.number().int().positive(),
  entities: z.array(entityRefSchema),
  operationId: z.string().min(1),
  payload: z.record(z.string(), z.unknown()).optional(),
  queryKeys: z.array(z.array(z.unknown())),
  revision: z.number().int().nonnegative(),
  userId: z.string().min(1),
});

export type MutationEvent = z.infer<typeof mutationEventSchema>;

export const uiCommandAckStatusValues = [
  "applied",
  "unsupported",
  "timeout",
  "no_client",
] as const;

export const uiCommandAckSchema = z.object({
  commandId: z.string().min(1),
  status: z.enum(uiCommandAckStatusValues),
});

export type UiCommandAck = z.infer<typeof uiCommandAckSchema>;

export const uiCommandCapabilityIds = [
  "set_view",
  "set_chrome",
  "set_selection",
] as const;

export const uiCommandSchema = z.object({
  capabilityId: z.enum(uiCommandCapabilityIds),
  clientSessionId: z.string().min(1),
  commandId: z.string().min(1),
  input: z.unknown(),
});

export type UiCommand = z.infer<typeof uiCommandSchema>;

export const chromeStateSchema = z.object({
  rail: z.enum(["commands", "chat"]),
  sidebar: z.enum(["open", "close"]),
});

export const uiContextSnapshotSchema = z.object({
  chrome: chromeStateSchema,
  clientSessionId: z.string().min(1),
  contextRevision: z.number().int().nonnegative(),
  draftText: z.string().nullable(),
  route: z.string().min(1),
  selection: z.object({
    assetId: z.string().nullable(),
  }),
  viewConfig: viewConfigSchema,
});

export type UiContextSnapshot = z.infer<typeof uiContextSnapshotSchema>;

export const renderSurfaceValues = ["workspace", "chat", "detail"] as const;

export const renderDescriptorSchema = z.object({
  catalogId: z.enum(["board", "command"]),
  dataRefs: z.array(
    z.object({
      queryKey: z.array(z.unknown()),
      statePath: z.string().min(1),
    })
  ),
  spec: z.custom<Spec>(),
  surface: z.enum(renderSurfaceValues),
});

export type RenderDescriptor = z.infer<typeof renderDescriptorSchema>;

export const connectionRequiredSchema = z.object({
  connectionId: z.string().min(1),
  kind: z.literal("connection_required"),
  operationId: z.string().min(1),
  resumeCapabilityId: z.string().min(1),
});

export type ConnectionRequired = z.infer<typeof connectionRequiredSchema>;
