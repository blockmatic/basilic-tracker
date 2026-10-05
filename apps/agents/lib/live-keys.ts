import { env } from "./env.js";

const isPlaceholderKey = (key: string) =>
  key.includes("dummy") || key.includes("placeholder") || key.includes("xxx");

export function hasLiveAnthropicKey() {
  const key = env.ANTHROPIC_API_KEY;
  if (!key || isPlaceholderKey(key)) {
    return false;
  }
  return true;
}

export function hasLiveGatewayKey() {
  const key = env.AI_GATEWAY_API_KEY ?? env.VERCEL_OIDC_TOKEN;
  if (!key || isPlaceholderKey(key)) {
    return false;
  }
  return true;
}
