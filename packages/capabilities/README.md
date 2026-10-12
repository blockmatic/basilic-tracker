# @repo/capabilities

Shared contracts for agent-native interaction: domain actions, UI commands, context snapshots, mutation results, and Gen UI render descriptors.

## Spike decisions (agent-native parity)

- **Event delivery:** `GET /events` supports cursor polling (`after` + `limit`) and optional SSE when `Accept: text/event-stream`. Polling is the Fluid-safe default; SSE reuses the same event iterator.
- **Voice:** Browser `SpeechRecognition` transcripts call the same `useEveAgent` `send` path as typed input. No OpenAI Realtime dependency in the starter.
- **Integration resume:** Use existing OAuth link routes plus a `connection_required` tool result and client resume card. `@vercel/connect` stays optional until a dedicated spike lands.
