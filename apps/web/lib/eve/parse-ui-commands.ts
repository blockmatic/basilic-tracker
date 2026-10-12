import type { UiCommandAck } from "@repo/capabilities";

import { viewConfigFromEvents } from "./parse-view";

export function uiCommandsFromEvents({
  events,
}: {
  events: readonly { type: string; data?: unknown }[];
}) {
  const view = viewConfigFromEvents({ events });
  const acks: UiCommandAck[] = [];
  for (const event of events) {
    if (
      event.type !== "action.result" ||
      typeof event.data !== "object" ||
      event.data === null
    ) {
      continue;
    }
    const { result } = event.data as { result?: unknown };
    const rows = Array.isArray(result) ? result : [result];
    for (const row of rows) {
      if (typeof row !== "object" || row === null) {
        continue;
      }
      const record = row as {
        toolName?: unknown;
        output?: unknown;
        isError?: unknown;
      };
      if (record.isError || record.toolName !== "set_chrome") {
        continue;
      }
      const output = record.output as { ack?: UiCommandAck };
      if (output?.ack) {
        acks.push(output.ack);
      }
    }
  }
  return { acks, view };
}
