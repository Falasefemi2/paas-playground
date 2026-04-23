# PaaS Playground — Frontend

A minimal PaaS deployment dashboard built with React, Vite, TanStack Query, and Tailwind CSS.

## What it does

- Submit a Git repository URL to trigger a deployment
- View all deployments with live status updates
- Stream live build logs via SSE for any deployment

## Tech Stack

- **Framework** — React + Vite
- **Data Fetching** — TanStack Query
- **Styling** — Tailwind CSS + shadcn/ui
- **Language** — TypeScript

## Getting Started

### Prerequisites

- Bun installed
- Backend running on `http://localhost:3000`

### Setup

1. Install dependencies:
```bash
bun install
```

2. Start the dev server:
```bash
bun run dev
```

Frontend runs on `http://localhost:5173`

## Make sure backend is running first

```bash
cd ../backend
bun run src/index.ts
```

## How it works

- Deployment list polls `GET /deployments` every 3 seconds
- Submitting a URL calls `POST /deployments`
- Clicking "View Logs" opens an `EventSource` connection to `GET /deployments/:id/logs/stream`
- Logs stream in real time and auto-scroll to the bottom
