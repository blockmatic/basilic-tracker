# Agents

Eve workspace (`@repo/agents`) with product agents **operator** and **ask**. Canonical docs: [Eve](https://basilic-docs.vercel.app/docs/architecture/eve). Sibling process of Fastify (`apps/api`).

Read bundled docs before changing eve files: `node_modules/eve/docs/README.md`.

## HTTP

Public mounts (Portless locally, one Vercel project in production):

- Operator: `https://agents.tracker.localhost/eve/operator` — `GET /eve/operator/v1/health`
- Ask: `https://agents.tracker.localhost/eve/ask` — `GET /eve/ask/v1/health`

Each eve process still serves `/eve/v1/*` on a loopback port. `scripts/dev-workspace.mjs` (Portless `dev:app`) strips the public prefix. Fastify `GET /agents` advertises the public mounts (`EVE_COMMAND_URL`, `EVE_CHAT_URL`).

## Models

Language models use `ANTHROPIC_API_KEY` in `apps/agents/.env` (Haiku default: `claude-haiku-4-5`). Jev (`typesafe-ai/jev`) uses `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN` on the eve host only. Eve does not read Fastify `apps/api/.env`.

## Local process

Root `pnpm dev` starts one Portless host after `@repo/db#db:start`. That process spawns operator and ask on loopback (`EVE_COMMAND_INTERNAL_PORT` / `EVE_CHAT_INTERNAL_PORT`, defaults 3104 / 3105) and proxies `/eve/operator` and `/eve/ask`. Direct unprefixed eve: `pnpm --filter @repo/agents eve:dev:operator:app` / `eve:dev:ask:app`.

## pnpm commands

- `pnpm --filter @repo/agents eve:dev` — workspace via Portless (also started by root `pnpm dev`)
- `pnpm --filter @repo/agents eve:dev:operator:app` — operator only, `/eve/v1` (no public prefix)
- `pnpm --filter @repo/agents eve:dev:ask:app` — ask only, `/eve/v1`
- `pnpm --filter @repo/agents eve:eval` / `eve:eval:ask` — live evals when keys are set (not default CI)
- `pnpm --filter @repo/agents test` — unit tests; live Jev needs a real Gateway key

Health:

```bash
curl -sS https://agents.tracker.localhost/eve/operator/v1/health
curl -sS https://agents.tracker.localhost/eve/ask/v1/health
```

Operator runs Jev `evaluateBoardTurn` when Gateway credentials exist; ask uses Anthropic only. Runtime skill: `agents/operator/agent/skills/view-config.md`. Evals: `agents/operator/evals/*.eval.ts`, `agents/ask/evals/*.eval.ts`.

Architecture: [Eve](https://basilic-docs.vercel.app/docs/architecture/eve). Runtime: [ADR 014](https://basilic-docs.vercel.app/docs/adrs/014-fastify-eve-vercel-runtime).
