"use client";

import type { UiCommand, UiCommandAck } from "@repo/capabilities";
import { useQueryStates } from "nuqs";
import { useCallback, useEffect, useRef } from "react";

import { chromeParsers } from "@/lib/coins/chrome";
import {
  boardViewParsers,
  parseViewConfig,
  viewConfigToSearchPatch,
} from "@/lib/genui";

type SinkListener = (command: UiCommand) => Promise<UiCommandAck>;

const sinks = new Map<string, SinkListener>();

export function registerUiCommandSink({
  clientSessionId,
  listener,
}: {
  clientSessionId: string;
  listener: SinkListener;
}) {
  sinks.set(clientSessionId, listener);
  return () => {
    sinks.delete(clientSessionId);
  };
}

export async function deliverUiCommand(
  command: UiCommand
): Promise<UiCommandAck> {
  const listener = sinks.get(command.clientSessionId);
  if (!listener) {
    return { commandId: command.commandId, status: "no_client" };
  }
  return listener(command);
}

export function useUiCommandSink({
  clientSessionId,
}: {
  clientSessionId: string;
}) {
  const [, setChrome] = useQueryStates(chromeParsers);
  const [, setView] = useQueryStates(boardViewParsers, {
    history: "push",
    shallow: true,
  });
  const focusRef = useRef<string | null>(null);

  const dispatch = useCallback(
    async (command: UiCommand): Promise<UiCommandAck> => {
      if (command.capabilityId === "set_chrome") {
        const input = command.input as { rail?: "chat" | "commands" };
        if (input.rail) {
          await setChrome({ rail: input.rail });
        }
        return { commandId: command.commandId, status: "applied" };
      }
      if (command.capabilityId === "set_view") {
        const viewConfig = parseViewConfig({ value: command.input });
        if (!viewConfig) {
          return { commandId: command.commandId, status: "unsupported" };
        }
        await setView(viewConfigToSearchPatch({ viewConfig }), {
          history: "push",
          shallow: true,
        });
        return { commandId: command.commandId, status: "applied" };
      }
      if (command.capabilityId === "set_selection") {
        const input = command.input as { assetId?: string | null };
        focusRef.current = input.assetId ?? null;
        if (input.assetId) {
          await setView(
            { focus: input.assetId },
            {
              history: "push",
              shallow: true,
            }
          );
        }
        return { commandId: command.commandId, status: "applied" };
      }
      return { commandId: command.commandId, status: "unsupported" };
    },
    [setChrome, setView]
  );

  useEffect(
    () =>
      registerUiCommandSink({
        clientSessionId,
        listener: dispatch,
      }),
    [clientSessionId, dispatch]
  );

  return { focusRef };
}
