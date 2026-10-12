import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Render the current board table inside chat using the shared board catalog.",
  execute: () => ({
    renderDescriptor: {
      catalogId: "board",
      dataRefs: [
        { queryKey: ["coins", "list"], statePath: "/coins" },
        { queryKey: ["coins", "watches"], statePath: "/watches" },
      ],
      spec: {
        elements: {
          table: {
            children: [],
            props: {
              columns: ["rank", "identity", "price", "change24h", "watch"],
            },
            type: "DataTable",
          },
        },
        root: "table",
      },
      surface: "chat",
    },
  }),
  inputSchema: z.object({}),
});
