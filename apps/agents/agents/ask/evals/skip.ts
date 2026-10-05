import { hasLiveAnthropicKey } from "#lib/live-keys.js";

export function skipIfNoLanguageModel({
  skip,
}: {
  skip: (reason: string) => void;
}) {
  if (hasLiveAnthropicKey()) {
    return false;
  }
  skip("Ask evals need ANTHROPIC_API_KEY in apps/agents/.env");
  return true;
}

export const marketsTools = [
  "get_markets",
  "get_asset",
  "get_candles",
  "get_global",
  "get_quote",
  "get_trending",
  "search_assets",
  "watch_asset",
  "unwatch_asset",
  "set_view",
] as const;
