FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DATABASE_URL=postgresql://gipa_user:gipa_password@db:5432/gipa_db?connection_limit=10
ARG RESEND_API_KEY=build_placeholder
ARG RESEND_FROM_EMAIL=build@example.com
ARG CONTACT_NOTIFICATION_TO=build@example.com
ARG DRIVER_NOTIFICATION_TO=build@example.com
ARG GOOGLE_CLIENT_EMAIL=build-service-account@project-id.iam.gserviceaccount.com
ARG GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\\nBUILD_PLACEHOLDER\\n-----END PRIVATE KEY-----\\n
ARG GOOGLE_DRIVE_FOLDER_ID=build-folder-id
ENV DATABASE_URL=${DATABASE_URL}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV RESEND_FROM_EMAIL=${RESEND_FROM_EMAIL}
ENV CONTACT_NOTIFICATION_TO=${CONTACT_NOTIFICATION_TO}
ENV DRIVER_NOTIFICATION_TO=${DRIVER_NOTIFICATION_TO}
ENV GOOGLE_CLIENT_EMAIL=${GOOGLE_CLIENT_EMAIL}
ENV GOOGLE_PRIVATE_KEY=${GOOGLE_PRIVATE_KEY}
ENV GOOGLE_DRIVE_FOLDER_ID=${GOOGLE_DRIVE_FOLDER_ID}
RUN npm run build

FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "server.js"]
