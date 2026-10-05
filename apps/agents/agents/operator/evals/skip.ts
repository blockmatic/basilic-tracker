import { hasLiveAnthropicKey, hasLiveGatewayKey } from "#lib/live-keys.js";

export function skipIfNoCommandModel({
  skip,
}: {
  skip: (reason: string) => void;
}) {
  if (hasLiveAnthropicKey() || hasLiveGatewayKey()) {
    return false;
  }
  skip(
    "Operator evals need ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY (Jev) in apps/agents/.env"
  );
  return true;
}

export const marketWatchTools = [
  "get_markets",
  "get_asset",
  "get_candles",
  "get_global",
  "get_quote",
  "get_trending",
  "search_assets",
  "watch_asset",
  "unwatch_asset",
  "list_watches",
] as const;
