import { randomUUID } from "node:crypto";

import { McpServer, type CallToolResult } from "@modelcontextprotocol/server";
import type { DomainRegistry } from "@repo/capabilities";
import type { FastifyInstance } from "fastify";
import type { z } from "zod";

import { executeDomainCapability } from "./capabilities/execute.js";
import { domainRegistry } from "./capabilities/registry.js";

const toResult = (value: Record<string, unknown>): CallToolResult => ({
  content: [{ text: JSON.stringify(value), type: "text" }],
  structuredContent: value,
});

function registerDomainTools({
  getUserId,
  registry,
  server,
}: {
  getUserId: () => string;
  registry: DomainRegistry;
  server: McpServer;
}) {
  for (const action of Object.values(registry)) {
    server.registerTool(
      action.id,
      {
        description: `Domain capability ${action.id}`,
        inputSchema: action.inputSchema as z.ZodObject<z.ZodRawShape>,
      },
      async (input: Record<string, unknown>) => {
        const operationId =
          typeof input === "object" &&
          input !== null &&
          "operationId" in input &&
          typeof (input as { operationId?: unknown }).operationId === "string"
            ? (input as { operationId: string }).operationId
            : randomUUID();
        const capabilityInput =
          typeof input === "object" && input !== null
            ? Object.fromEntries(
                Object.entries(input).filter(([key]) => key !== "operationId")
              )
            : input;
        try {
          const { mutation, output } = await executeDomainCapability({
            capabilityId: action.id,
            input: capabilityInput,
            operationId,
            registry,
            userId: getUserId(),
          });
          return toResult({ mutation, output });
        } catch (error) {
          return toResult({
            error: error instanceof Error ? error.message : "capability failed",
          });
        }
      }
    );
  }
}

export function createDomainMcpServer({
  registry = domainRegistry,
  userId,
}: {
  fastify: FastifyInstance;
  registry?: DomainRegistry;
  userId: string;
}): McpServer {
  const server = new McpServer({ name: "tracker-domain", version: "1.0.0" });
  registerDomainTools({
    getUserId: () => userId,
    registry,
    server,
  });
  return server;
}
