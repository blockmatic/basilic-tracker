# Architecture

Built with [Basilic](https://github.com/blockmatic/basilic). `apps/web` calls the API through `@repo/core`. Command and chat agents call eve tools, which use `@repo/markets`, `@repo/onchain`, and `@repo/db`. GenUI renders typed tool results. URL state lives in `view-config` and nuqs.

The coin board uses `apps/web/lib/genui/catalog.ts` (`boardCatalog`) and `apps/web/components/genui/registry.tsx` for market-specific components (`DataTable`, charts, wallet tiles). A shared shadcn-aligned command surface catalog lives in `apps/web/lib/genui/command-catalog` with renderers in `apps/web/components/genui/command-registry` (layout, data display, inputs, actions, overlays, conversation, and starter cards). Both catalogs map component names to `@repo/ui` (`base-vega`).

Schema additions (`assets*`, `coin_watches`, wallet tables) sit on the auth tables. Migrations `0000`–`0021` stay in this workspace.

Portless hosts are `tracker.localhost` and its API, agents, and email siblings. Vercel Root Directories are `apps/web`, `apps/api`, and `apps/agents`. Include source files outside the Root Directory. There is no docs Vercel project.

Coin Tracker env: `COINGECKO_DEMO_API_KEY`, `COINS_USE_FIXTURE`, `MARKETS_CACHE_MS`, `ALCHEMY_API_KEY`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, `EVE_CHAT_URL`.
