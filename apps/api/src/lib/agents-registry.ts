import { Type } from "@sinclair/typebox";

export const agentIds = ["operator", "ask"] as const;
export type AgentId = (typeof agentIds)[number];

export const AgentRecordSchema = Type.Object({
  capabilities: Type.Array(Type.String()),
  endpoint: Type.String({ minLength: 1 }),
  features: Type.Array(Type.String()),
  id: Type.Union([Type.Literal("operator"), Type.Literal("ask")]),
  name: Type.String(),
  presentation: Type.String(),
  transport: Type.Literal("eve"),
});

export function agentCatalog({
  operatorUrl,
  askUrl,
}: {
  operatorUrl: string;
  askUrl: string;
}): {
  id: AgentId;
  name: string;
  endpoint: string;
  transport: "eve";
  presentation: string;
  capabilities: string[];
  features: string[];
}[] {
  return [
    {
      capabilities: ["markets", "watches"],
      endpoint: operatorUrl.replace(/\/$/, ""),
      features: ["tools"],
      id: "operator",
      name: "Operator",
      presentation: "commands",
      transport: "eve",
    },
    {
      capabilities: ["watches-read"],
      endpoint: askUrl.replace(/\/$/, ""),
      features: ["transcript"],
      id: "ask",
      name: "Ask",
      presentation: "chat",
      transport: "eve",
    },
  ];
}

export function agentById({
  agentId,
  operatorUrl,
  askUrl,
}: {
  agentId: string;
  operatorUrl: string;
  askUrl: string;
}) {
  return (
    agentCatalog({ askUrl, operatorUrl }).find((row) => row.id === agentId) ??
    null
  );
}
