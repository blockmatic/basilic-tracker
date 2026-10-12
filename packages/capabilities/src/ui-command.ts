import type { UiCommand, UiCommandAck } from "./schemas.js";

export const uiCommandTimeoutMs = 3000;

export async function dispatchUiCommand({
  command,
  sink,
}: {
  command: UiCommand;
  sink: {
    clientSessionId: string;
    dispatch: (command: UiCommand) => Promise<UiCommandAck>;
  } | null;
}): Promise<UiCommandAck> {
  if (!sink || sink.clientSessionId !== command.clientSessionId) {
    return { commandId: command.commandId, status: "no_client" };
  }
  const timeout = new Promise<UiCommandAck>((resolve) => {
    setTimeout(
      () => resolve({ commandId: command.commandId, status: "timeout" }),
      uiCommandTimeoutMs
    );
  });
  return Promise.race([sink.dispatch(command), timeout]);
}
