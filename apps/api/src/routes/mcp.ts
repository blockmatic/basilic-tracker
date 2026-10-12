import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";
import type { FastifyPluginAsync } from "fastify";

import { sendCatalogError } from "../lib/catalogs/mapper.js";
import { createDomainMcpServer } from "../lib/mcp.js";

const mcpRoute: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    handler: async (request, reply) => {
      if (!request.session) {
        return sendCatalogError({ reply, status: 401, code: "UNAUTHORIZED" });
      }
      const userId = request.session.user.id;
      const handler = createMcpHandler(() =>
        createDomainMcpServer({ fastify, userId })
      );
      const serve = toNodeHandler(handler);
      reply.hijack();
      try {
        await serve(request.raw, reply.raw, request.body);
      } finally {
        await handler.close();
      }
    },
    method: ["GET", "POST", "DELETE"],
    schema: { hide: true, security: [], tags: ["agents"] },
    url: "/mcp",
  });
};

export default mcpRoute;
