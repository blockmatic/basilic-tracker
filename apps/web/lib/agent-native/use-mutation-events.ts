"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { getAuthToken } from "@/lib/auth/auth-client";
import { env } from "@/lib/env";

const mutationCursorKey = ["agent-native", "mutation-cursor"] as const;

export function useMutationEventSync() {
  const queryClient = useQueryClient();
  const cursorRef = useRef(0);

  const { data } = useQuery({
    enabled: Boolean(env.NEXT_PUBLIC_API_URL),
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) {
        return { events: [], nextCursor: cursorRef.current };
      }
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/events/?after=${cursorRef.current}&limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("mutation events failed");
      }
      const body = (await response.json()) as {
        events: {
          cursor: number;
          queryKeys: unknown[][];
        }[];
      };
      return body;
    },
    queryKey: mutationCursorKey,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (!data?.events.length) {
      return;
    }
    for (const event of data.events) {
      cursorRef.current = Math.max(cursorRef.current, event.cursor);
      for (const queryKey of event.queryKeys) {
        queryClient.invalidateQueries({ queryKey });
      }
    }
  }, [data, queryClient]);
}
