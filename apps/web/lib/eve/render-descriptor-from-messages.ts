import {
  renderDescriptorSchema,
  type RenderDescriptor,
} from "@repo/capabilities";

export function renderDescriptorFromMessageParts({
  parts,
}: {
  parts: readonly { type: string; [key: string]: unknown }[];
}): RenderDescriptor | null {
  for (const part of parts) {
    if (part.type !== "dynamic-tool") {
      continue;
    }
    const toolName = part.toolName;
    if (toolName !== "render_board") {
      continue;
    }
    const output = part.output;
    if (typeof output !== "object" || output === null) {
      continue;
    }
    const descriptor = (output as { renderDescriptor?: unknown })
      .renderDescriptor;
    const parsed = renderDescriptorSchema.safeParse(descriptor);
    if (parsed.success) {
      return parsed.data;
    }
  }
  return null;
}
