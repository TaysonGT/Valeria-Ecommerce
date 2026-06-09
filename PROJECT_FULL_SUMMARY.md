# Valeria E-commerce — Project Overview (Complete)

## Summary

This document is a complete, passionate, and practical guide to the Valeria E‑commerce project — covering the entire monorepo (frontend and backend), architecture, APIs, setup, development workflow, deployment notes, and next steps. Use this as the single source of truth for contributors, reviewers, and maintainers.

---

## Table of Contents

- Project summary
- High-level architecture
- Repository layout
- Frontend (client/) details
- Backend (server/) details
- API endpoints & schemas
- Authentication & security
- Data & persistence
- Scripts, setup & local development
- Testing and quality
- Deployment & hosting
- Contributing and style
- Next steps and roadmap
- Reference: important files

---

## Project summary

Valeria is a full-stack e‑commerce application providing product browsing, cart management, checkout flow, order management, user authentication, and admin reporting capabilities. The codebase is split into two main parts:

- `client/` — Frontend app
- `server/` — Backend app

The project emphasizes pragmatic security (scrypt password hashing, JWTs), transactional order creation, and a clear separation between UI and services.

---

## High-level architecture

- Client: React + Vite, TypeScript, Tailwind, componentized UI, context for auth/cart, hooks for data fetching.
- Server: TypeScript app exposing REST endpoints for products, users, orders, reporting, image uploads, and shipment tracking.
- Database: MongoDB-style schemas (see `server/src/schemas/`) with transactional order creation.
- Authentication: JWT-based, cookie storage on frontend, `auth.middleware` on backend.
- Payment: Abstracted payment service (server), with hooks for integrating Stripe/PayPal.

---

## Repository layout

Top-level files and folders:

- `client/` — Frontend app
- `server/` — Backend app
- `CHECKOUT_FLOW_SUMMARY.md` — Existing focused checkout summary
- `PROJECT_FULL_SUMMARY.md` — (this file)

Key subfolders (high level):

- `client/src/components/` — UI components (Navbar, ProductCard, Cart, Modal, etc.)
- `client/src/context/` — `AuthContext`, `CartContext`, `SearchContext`
- `client/src/pages/` — Route pages: Auth, Checkout, OrderTracking, Dashboard, Product pages
- `client/src/hooks/` — Custom hooks (useProduct, useOrders, useOutsideClick)
- `server/src/controllers/` — Route handlers for orders, products, users, reporting
- `server/src/services/` — Business logic (order.service, payment.service, search.service)
- `server/src/schemas/` — Data models and validation schemas
- `server/src/middlewares/` — `auth.middleware.ts` and helpers

---

## Frontend (client/) details

Purpose: user-facing SPA for browsing products, managing carts, completing checkout, and tracking orders.

Tech stack: React + TypeScript + Vite + Tailwind (postcss) + simple context-based state.

Important patterns and files:

- `client/src/context/AuthContext.tsx` — central auth provider: token management, auto-login, `login()`, `register()`, `logout()`.
- `client/src/components/` — reusable UI (Button, Modal, Avatar, ShippingStatus, ProductCard).
- `client/src/pages/Checkout/index.tsx` — fully featured checkout form and summary (customer info, shipping, billing, payment) and order submission.
- `client/src/pages/OrderTracking/index.tsx` — lists user orders and shows details.
- `client/src/routes/` — route guards:
  - `LoginRoute.tsx` — redirects logged-in users and protects login route
  - `PrivateRoutes.tsx` — protects routes like `/checkout`, `/orders`

UX notes:

- Cart state is stored in `CartContext` and used by checkout and order creation.
- Forms use local validation and show clear loading/error states.

API usage (examples):

- `POST /users/auth/login` — on login
- `POST /orders/create` — when placing orders
- `GET /orders` and `GET /orders/:id` — for order tracking

Where to look:

- Core: `client/src/App.tsx`, `client/src/main.tsx`
- Auth: `client/src/context/AuthContext.tsx` and `client/src/pages/Auth/`
- Checkout: `client/src/pages/Checkout/index.tsx`

---

## Backend (server/) details

Purpose: provide secure REST APIs for products, users, orders, reporting, shipments, and image uploads.

Tech stack: Node + TypeScript, Express-style routing, MongoDB (or compatible), environment-based configuration.

Key modules:

- `server/src/controllers/` — controllers that parse requests and call services (order, product, user, reporting).
- `server/src/services/` — core business logic. Notable services:
  - `order.service.ts` — transactional order creation, inventory checks, payment orchestration.
  - `payment.service.ts` — payment gateway integration point (abstracted).
  - `user.service.ts` — password hashing, user creation, token generation.
- `server/src/middlewares/auth.middleware.ts` — verifies JWTs, attaches `AuthenticatedRequest.user`, provides `isAdmin()`.
- `server/src/schemas/` — data models and validation (product, order, user, category, collection, etc.).

Security & correctness:

- Passwords hashed with scrypt, salted per user.
- JWT token lifetime and secrets are stored in environment variables.
- Order creation uses atomic inventory reductions (MongoDB transactions recommended).

Where to look:

- App entry: `server/src/app.ts`
- Controllers: `server/src/controllers/order.controller.ts`, `server/src/controllers/user.controller.ts`
- Services: `server/src/services/order.service.ts`, `server/src/services/user.service.ts`

---

## API endpoints & schemas

This project exposes REST endpoints across `server/src/routes/`.

Typical endpoints (not exhaustive):

- Users
  - `POST /users/auth/register` — register
  - `POST /users/auth/login` — login -> returns token
  - `GET /users/me` — current user

- Orders
  - `POST /orders/create` — create order (auth required)
  - `GET /orders` — list user orders (auth required)
  - `GET /orders/:orderId` — order details (auth required)

- Products
  - `GET /products` — list
  - `GET /products/:id` — details

- Reporting and shipment endpoints are present for admin and background tasks.

Schemas and models live in `server/src/schemas/` — consult those files for exact field names and validation rules.

---

## Authentication & security

- Password hashing: scrypt + per-user salt (see `server/src/services/user.service.ts`).
- Tokens: JWTs with server secret stored via env variables.
- Middleware: `authenticate()` adds `req.user` and returns HTTP 401 on failures; `isAdmin()` for admin routes.
- Frontend stores token in cookie and refreshes on mount via `AuthContext`.

Security recommendations:

- Rotate JWT secret on deploy and use short lifetimes for critical routes.
- Add rate-limiting on auth endpoints.
- Consider adding email verification and 2FA for production.

---

## Data & persistence

- Data models are defined under `server/src/schemas/`.
- Orders capture product snapshots (price at time of purchase) to prevent inconsistencies after price changes.
- Inventory decrements are performed inside a transaction to prevent overselling.

Backups & migrations:

- Use regular database backups and a migration strategy (migration scripts or a tool like Mongock/Flyway for MongoDB).

---

## Scripts, setup & local development

Root-level `package.json` files refer to project-level tooling. Each `client/` and `server/` also have their own `package.json` with helpful scripts.

Common commands (run from repo root or applicable subfolder):

Install dependencies:

```bash
# client
cd client && npm install

# server
cd server && npm install
```

Run frontend dev server:

```bash
cd client
npm run dev
```

Run backend dev server (watch mode):

```bash
cd server
npm run dev
```

Build for production:

```bash
cd client
npm run build

cd server
npm run build
```

Environment variables (examples — set in `.env` files):

- `JWT_SECRET` — JWT signing key
- `DB_URI` — MongoDB connection string
- `PORT` — backend port
- `PAYMENT_PROVIDER_KEY` — API key for payment gateway (if used)

See `server/.env.example` and `client/.env.example` if present for exact names.

---

## Testing and quality

- Unit tests: add tests near services and controllers. If a test suite exists, run with `npm test` in the relevant folder.
- Linting: `client/` contains ESLint config (`eslint.config.ts`). Run `npm run lint` where configured.
- Type checking: TypeScript `tsconfig.json` is present in both client and server — run `npm run build` or `tsc --noEmit` for type checks.

CI Suggestions:

- Add CI jobs for:
  - `npm ci && npm run build` in both client and server
  - `npm run lint` and `npm test`
  - Security scans for dependencies (dependabot, snyk)

---

## Deployment & hosting

Frontend:

- Build static assets with `npm run build` in `client/`, then serve via CDN / static host (Netlify, Vercel, or S3 + CloudFront). Vite produces a static `dist/` folder.

Backend:

- Host on Node-capable platform (Heroku, Render, DigitalOcean App Platform), or containerize via Docker and deploy to Kubernetes or ECS. Ensure `DB_URI` and `JWT_SECRET` are provided as secrets.

Database:

- Use managed MongoDB (Atlas) for production and enable backups and monitoring.

Payment & webhooks:

- If integrating Stripe/PayPal, configure webhook endpoints and verify signatures. Store webhook endpoint secrets securely.

---

## Contributing and style

- Code style: follow existing TypeScript patterns, prefer explicit types in public APIs, and keep components small and composable.
- Commit messages: use concise messages and consider Conventional Commits for automation.
- Branching: feature branches named `feat/<short-desc>` and PR-based reviews.

Developer checklist for PRs:

1. Run unit tests and type checks
2. Run linting and fix issues
3. Confirm manual testing for critical flows (login, create order)

---

## Next steps & roadmap (suggested)

1. Integrate a production payment gateway (Stripe) and webhook handlers.
2. Add automated email notifications for order confirmations and shipping updates.
3. Create an Admin dashboard with role-based views and order management tools.
4. Add integration and e2e tests for checkout and order flows (Cypress/Playwright).
5. Add observability: logging, metrics, and error tracking (Sentry, Prometheus).

---

## Reference: important files

- Frontend entry: client/src/main.tsx
- Frontend App: client/src/App.tsx
- Auth context: client/src/context/AuthContext.tsx
- Checkout page: client/src/pages/Checkout/index.tsx
- Backend app: server/src/app.ts
- Orders controller: server/src/controllers/order.controller.ts
- User service: server/src/services/user.service.ts
- Auth middleware: server/src/middlewares/auth.middleware.ts

---

If you want, I can:

- generate a compact `README.md` for the repo root summarizing these points,
- or open a PR with this `PROJECT_FULL_SUMMARY.md` and update `package.json` scripts.

Tell me which next step you prefer.
