# RuangRasa Admin Panel

## Project structure

- `src/App.tsx` defines the application routes.
- `src/pages/` contains screen components; shared UI and dialogs live in `src/components/`.
- `src/hooks/` contains application state and reusable UI/data hooks.
- `src/services/` contains the API client; the local Node.js API and SQLite seed live in `server/`.
- `src/data/mock/` contains fixtures for screens not yet backed by the API.

## Development and validation

- Use Node.js 22.13 or newer.
- Run the frontend and local API together with `npm run dev:fullstack`.
- Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run format:check` after relevant changes.
- Keep the API bound to localhost for the demo. Do not use real credentials or user data.

## Conventions

- Use the existing Indonesian/English dictionary in `src/locales.ts` for static interface copy.
- Keep API access in `src/services/` and React hooks, not directly in page components.
- Tailwind CSS v4 is imported through `src/index.css`; shared global styling belongs there.
- Read `README.md` for setup, routes, data boundaries, and prototype limitations.
