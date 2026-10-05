import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import { commandSurfaceComponentDefinitions } from "./definitions";

export const commandSurfaceCatalog = defineCatalog(schema, {
  actions: {},
  components: commandSurfaceComponentDefinitions,
});

export { commandSurfaceComponentDefinitions } from "./definitions";
export type { CommandSurfaceComponentProps } from "./definitions";
