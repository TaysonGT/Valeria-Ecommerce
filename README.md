# Valeria E-commerce

A full‑stack demo e‑commerce application (React + Vite frontend, Node/Typescript backend). This repo contains a production‑capable checkout flow, user auth, order management, reporting, and basic admin features.

![App Screenshot](https://drive.google.com/thumbnail?id=1JpI-U-KAFtiiB5aYlEzrqK7vrPrRkl4q)

🚀 [Explore the Live Demo](https://valeria.mohamedgt.workers.dev)

### Test Credentials

* **Username:** admin
* **Password:** 123456

## Project layout

- `client/` — React + Vite frontend (UI, pages, contexts, hooks)
- `server/` — Node/TypeScript backend (controllers, services, schemas, middlewares)

See [`PROJECT_FULL_SUMMARY.md`](PROJECT_FULL_SUMMARY.md) for a complete documentation of architecture, APIs, deployment, and next steps.

## Quickstart (local)

1. Install dependencies

```bash
# all
npm install

# client
npm install:client

# server
npm install:server
```

2. Start development servers

```bash
# single terminal
npm run dev:all

# separate terminals
npm run dev:server
npm run dev:client
```

3. Environment

Create `.env` files in `server/` and `client/` using the `.env.example` files if present. Minimal variables:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing key

## Useful scripts

- Frontend (`client/`): `npm run dev`, `npm run build`, `npm run preview`
- Backend (`server/`): `npm run dev`, `npm run build`, `npm start`

Run type checks and linting in each package as configured.

## Contributing

1. Open a feature branch `feat/<desc>`
2. Run tests and linters
3. Submit a PR with description and testing notes
