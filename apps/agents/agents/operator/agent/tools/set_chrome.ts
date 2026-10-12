import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Change the board chrome rail (commands or chat). Returns an ack for the targeted browser session.",
  execute: (input) => ({
    ack: {
      commandId: input.commandId,
      status: "applied" as const,
    },
    rail: input.rail,
  }),
  inputSchema: z.object({
    commandId: z.string().min(1),
    rail: z.enum(["commands", "chat"]),
  }),
});
