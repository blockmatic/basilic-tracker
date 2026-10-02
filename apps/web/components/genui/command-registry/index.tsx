"use client";

import { defineRegistry } from "@json-render/react";

import { commandSurfaceCatalog } from "@/lib/genui/command-catalog";

import { cardComponents } from "./cards";
import { conversationComponents } from "./conversation";
import { coreComponents } from "./core";
import { extraComponents } from "./extra";
import { overlayComponents } from "./overlays";

export const { registry: commandSurfaceRegistry } = defineRegistry(
  commandSurfaceCatalog,
  {
    actions: {},
    components: {
      ...coreComponents,
      ...extraComponents,
      ...overlayComponents,
      ...conversationComponents,
      ...cardComponents,
    },
  }
);
