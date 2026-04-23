# PaaS Playground — Backend

A minimal PaaS-style deployment backend built with Bun, Hono, Effect-ts, Drizzle ORM, and PostgreSQL.

## What it does

- Accepts a Git repository URL and creates a deployment
- Runs a pipeline in the background: clone → install → run
- Tracks deployment status in real time: `pending → cloning → building → running → failed`
- Streams live logs to connected clients via SSE (Server-Sent Events)
- Persists all deployment state in PostgreSQL

## Tech Stack

- **Runtime** — Bun
- **HTTP Framework** — Hono
- **Effects** — Effect-ts
- **ORM** — Drizzle ORM
- **Database** — PostgreSQL
- **DB Driver** — @effect/sql-pg

## Project Structure

```
backend/
├── src/
│   ├── index.ts          # Server entry point
│   ├── pipeline.ts       # Deployment pipeline runner
│   ├── sse.ts            # SSE client manager
│   ├── db/
│   │   ├── index.ts      # DB connection and Effect layers
│   │   └── schema.ts     # Drizzle schema
│   └── routes/
│       └── deployments.ts # Deployment routes
├── drizzle/              # Migration files
├── drizzle.config.ts     # Drizzle Kit config
└── workspace/            # Cloned repos (gitignored)
```

## Getting Started

### Prerequisites

- Bun installed
- PostgreSQL running
- Git installed

### Setup

1. Install dependencies:
```bash
bun install
```

2. Create a `.env` file:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/paas_playground
```

3. Run migrations:
```bash
bunx drizzle-kit migrate
```

4. Start the server:
```bash
bun run src/index.ts
```

Server runs on `http://localhost:3000`

## API

### Create a deployment
```
POST /deployments
Content-Type: application/json

{ "repo_url": "https://github.com/user/repo" }
```

### List all deployments
```
GET /deployments
```

### Stream live logs
```
GET /deployments/:id/logs/stream
```

Connect with curl:
```bash
curl -N http://localhost:3000/deployments/DEPLOYMENT_ID/logs/stream
```

## How the pipeline works

1. Request comes in with a `repo_url`
2. Deployment record created with status `pending`
3. Response returned immediately to the client
4. Pipeline kicks off in the background:
   - `cloning` — git clone the repo into `./workspace/<id>`
   - `building` — npm install inside the cloned folder
   - `running` — start the app with `bun run index.ts`
   - `failed` — if any step fails, status and error message are saved
5. Each step broadcasts log lines to any open SSE connections

## Add to .gitignore

```
.env
node_modules/
workspace/
```
