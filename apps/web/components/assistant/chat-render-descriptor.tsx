"use client";

import { validateSpec } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import type { RenderDescriptor } from "@repo/capabilities";

import { boardRegistry } from "@/components/genui/registry";

export function ChatRenderDescriptor({
  descriptor,
  state,
}: {
  descriptor: RenderDescriptor;
  state: Record<string, unknown>;
}) {
  const validation = validateSpec(descriptor.spec);
  if (!validation.valid) {
    return (
      <p className="text-destructive text-sm" role="alert">
        Invalid generated view
      </p>
    );
  }
  return (
    <JSONUIProvider initialState={state} registry={boardRegistry}>
      <Renderer registry={boardRegistry} spec={descriptor.spec} />
    </JSONUIProvider>
  );
}
