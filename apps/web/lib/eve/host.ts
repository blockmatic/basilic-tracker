"use client";

import { coreClient } from "@/app/providers";

import type { PublicEveAgentId } from "./public-agent-id";

export async function listAgentEndpoint({
  id,
}: {
  id: PublicEveAgentId;
}): Promise<string> {
  const agents = await coreClient.listAgents();
  const agent = agents.find((row) => row.id === id);
  if (!agent?.endpoint) {
    throw new Error(`${id} agent is not advertised`);
  }
  return agent.endpoint;
}
