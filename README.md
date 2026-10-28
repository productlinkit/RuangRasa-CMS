# RuangRasa Admin Panel

This project is a React + Vite admin console prototype with a local Node.js API and SQLite database for the user and audit workflows. It uses fictional seed data and simulated authentication; it is not production-ready.

## Requirements and setup

- Node.js 22.13 or newer (the local API uses Node's built-in SQLite module)
- pnpm

Install dependencies once:

```bash
pnpm install
```

Run the API and frontend together:

```bash
pnpm dev:fullstack
```

Or start them separately with `pnpm dev:api` and `pnpm dev` in two terminals.

The API listens only on `127.0.0.1:3001`; Vite proxies `/api` to it. The app is served on port `5173` by default. Set `API_PORT` or `PORT` to change those ports. The API creates `.data/ruangrasa.sqlite` and seeds it with the fictional records in `server/seed.json`.

For the local demo login, use:

- Email: `nama@ruangrasa.id`
- Password: `ruangrasa`
- MFA code: `123456`

These are public demo values, not real credentials. The API checks them server-side and issues an HttpOnly cookie, but the account, MFA code, and in-memory session implementation are demo-only and must not be used to protect real data.

To create and serve a production build:

```bash
pnpm build
pnpm preview
```

When deployed to a static host such as Vercel (no Node API), the client detects the non-JSON `/api` response and switches to an in-browser demo API (`src/services/demoBackend.ts`) that uses the same demo login and seed data, stored in that browser's localStorage. `vercel.json` rewrites page URLs to `index.html` so direct links work.

`VITE_API_BASE_URL` defaults to `/api`. Copy `.env.example` to `.env.local` if you need to override it; Vite proxies `/api` to the local backend during development.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:api
pnpm test:coverage
pnpm format
```

The same package scripts can be run with npm (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`).

`pnpm lint:fix` applies safe ESLint fixes and `pnpm format:check` checks formatting without changing files.

## Project structure

- `src/pages/`: URL-addressable application screens and login flow
- `src/components/`: shared UI, route guard, responsive admin layout, and focused dialogs
- `src/hooks/`: responsive, shared application state, and localStorage persistence hooks
- `src/services/`: local API client and simulated auth flow
- `src/data/mock/`: remaining mock datasets and Indonesian/English interface copy
- `src/locales.ts` and `src/i18n.ts`: centralized static messages and Indonesian/English value selection for data-driven copy
- `src/types/`: shared TypeScript types
- `server/`: local HTTP API, SQLite setup, fictional seed records, and API integration tests
- `.data/`: generated local SQLite database (ignored by Git)

## Page URLs

Each admin page has its own path: `/overview`, `/users`, `/sessions`, `/safety`, `/rara`, `/plans`, `/notifications`, `/analytics`, `/content`, `/audit`, and `/settings`. These paths can be bookmarked and opened directly after login; unauthenticated visits are redirected to the login screen.

## Localization convention

User-facing labels should support both Indonesian (`ID`) and English (`EN`). Add static interface messages to the keyed dictionary in `src/locales.ts` and read them with `message(language, key)`. For language-dependent values that come from data, use the shared `localized` helper and provide both values at the data boundary. Keep both language variants together when adding copy.

## Data adapters

UI components should request mutable data through hooks or service interfaces, not implement storage or API access themselves. User CRUD, audit reads/writes, and the demo login call the local API; SQLite preserves user and audit changes across API restarts. Other editable page datasets/configuration still use the generic `usePersistentState` hook backed by localStorage. To connect a production API:

1. Replace or extend the routes in `server/index.mjs` with a separately deployed backend.
2. Implement server-side authentication and role/permission checks before exposing real data.
3. Implement API routes and hooks for the remaining domains, replacing generic browser persistence while keeping UI components independent of the data source.
4. Add API error, loading, authorization, and persistence tests for each domain.

## Authentication limitations

Authentication is a simulated demo flow and is **not safe for production**. The six-digit code and demo account are public, and the server keeps demo sessions in memory. Role-based access is still enforced only by the UI; the local API does not provide production authorization. Before production, replace the demo account and MFA with a real identity provider, server-side role/permission checks, durable and rotated sessions, HTTPS, rate limiting, secure secret management, and a server-side password reset flow. Do not use real credentials, phone numbers, conversation content, or safety case data with this demo.

## Remaining limitations

- Most screens still display mock/sample data. Only user and audit changes are stored in the local SQLite database; other editable records persist in the current browser's localStorage.
- The local API is intended for a single-machine demo, not network deployment, concurrent production traffic, or real user data.
- Some page components are still larger than the target of roughly 300 lines and need further focused extraction.
- The landing-page hero uses an externally hosted sample image, so that image is unavailable without a network connection.
- Authentication, MFA, and password reset are simulations only.
- API loading/error handling currently covers only the connected user-data workflow.
- End-to-end browser coverage and deployment automation are not yet implemented.
