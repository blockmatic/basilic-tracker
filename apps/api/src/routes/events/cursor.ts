import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { mutationEventSchema } from "@repo/capabilities";
import { listMutationEventsAfter, type MutationEventRow } from "@repo/db";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { sendCatalogError } from "../../lib/catalogs/mapper.js";
import { ErrorResponseSchema } from "../schemas.js";

const MutationEventSchema = Type.Object({
  capabilityId: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
  cursor: Type.Integer({ minimum: 1 }),
  entities: Type.Array(
    Type.Object({
      id: Type.String(),
      type: Type.String(),
    })
  ),
  operationId: Type.String(),
  payload: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  queryKeys: Type.Array(Type.Array(Type.Unknown())),
  revision: Type.Integer({ minimum: 0 }),
  userId: Type.String(),
});

const eventsCursorRoute: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    "/",
    {
      schema: {
        description:
          "User-scoped mutation cursor for cross-tab and external-agent sync. Poll with after cursor or request SSE via Accept: text/event-stream.",
        operationId: "listMutationEvents",
        querystring: Type.Object({
          after: Type.Optional(Type.Integer({ minimum: 0 })),
          limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
        }),
        response: {
          200: Type.Object({
            events: Type.Array(MutationEventSchema),
          }),
          401: ErrorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
        summary: "List mutation events",
        tags: ["events"],
      },
    },
    async (request, reply) => {
      if (!request.session) {
        return sendCatalogError({ reply, status: 401, code: "UNAUTHORIZED" });
      }
      const after = request.query.after ?? 0;
      const limit = request.query.limit ?? 50;
      const rows = await listMutationEventsAfter({
        after,
        limit,
        userId: request.session.user.id,
      });
      const events = rows.map((row: MutationEventRow) => {
        const parsed = mutationEventSchema.parse({
          capabilityId: row.capabilityId,
          createdAt: row.createdAt.toISOString(),
          cursor: row.cursor,
          entities: row.entities,
          operationId: row.operationId,
          payload: row.payload,
          queryKeys: row.queryKeys,
          revision: row.cursor,
          userId: row.userId,
        });
        return parsed;
      });
      const accept = request.headers.accept ?? "";
      if (accept.includes("text/event-stream")) {
        reply.raw.writeHead(200, {
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Content-Type": "text/event-stream",
        });
        for (const event of events) {
          reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
        }
        reply.raw.end();
        return reply;
      }
      return reply.code(200).send({ events });
    }
  );
};

export default eventsCursorRoute;
export const prefixOverride = "/events";
