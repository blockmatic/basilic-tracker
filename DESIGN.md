# DESIGN.md

> Visual language for Coin Tracker. Token **values** live in [`packages/ui/src/styles/tokens.css`](packages/ui/src/styles/tokens.css). Do not invent a second palette. Do not generate this file from `tokens.css`.

## Product

**Coin Tracker** is a Basilic app. Signed-in home is a generated **table** (json-render) plus a prompt rail: Commands history is navigation; the Chat tab is an eve transcript; the mic writes a draft with no LLM; sort and filter come from the command box or the URL; Commands have no assistant bubbles. Ephemeral dashboard widgets (`surface=dashboard`) are not pinned. Live boards that use CoinGecko Demo must keep CoinGecko attribution. Apps consume `@repo/ui` (shadcn/ui, Base UI, Tailwind 4). App-only UI stays in `apps/web`. There is no mobile app and no Doku app. Upstream design ADRs: [ADR 004](https://basilic-docs.vercel.app/docs/adrs/004-design-system), [ADR 013](https://basilic-docs.vercel.app/docs/adrs/013-shadcn-base-ui), and [Frontend](https://basilic-docs.vercel.app/docs/architecture/frontend).

## Docs

Product docs are `README.md`, `PRODUCT.md`, `ARCHITECTURE.md`, and this file. Canonical Basilic guides stay on https://basilic-docs.vercel.app.

## Color

Semantic tokens from `tokens.css` (`@theme inline`). Board 24h change uses `text-chart-2` for up and `text-destructive` for down. No second chart or brand palette in the apps.

## Typography

Inter, Poppins, and a monospace stack, as named in `tokens.css`. Do not add a fourth family.

## Layout

The **demo shell** is sidebar + main. Radius and sidebar tokens come from the same file. Components: `@repo/ui/components/*`. Open/checked styles use Base UI HTML attrs (`data-open`, `data-checked`), not Radix `data-state`.

## Motion

No extra motion guidelines beyond the existing `emilkowal-animations` / `motion-v13` skills.

## Verification

Browser verification is a bounded desktop + mobile screenshot pass plus keyboard — not visual-regression CI.
