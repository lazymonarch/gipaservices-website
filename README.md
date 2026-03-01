# GIPA Logistics Hub

Frontend migrated to Next.js App Router with TypeScript, Tailwind CSS, and shadcn/ui components.

## Run locally

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` - start Next.js dev server
- `npm run build` - build production app
- `npm run start` - run production server

## Local Docker Setup

Run the full local stack (Next.js app + PostgreSQL):

```sh
docker compose up --build
```

App URL:

```text
http://localhost:3000
```

Health check:

```sh
curl http://localhost:3000/api/health
```

### Prisma in Docker

Run migrations:

```sh
docker compose exec app npx prisma migrate deploy
```

If no migrations exist, sync schema directly:

```sh
docker compose exec app npx prisma db push
```
