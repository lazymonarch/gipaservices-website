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
ARG ZEPTOMAIL_SEND_TOKEN=build-zeptomail-token
ARG ZEPTOMAIL_FROM_EMAIL=build@example.com
ARG CONTACT_NOTIFICATION_TO=build@example.com
ARG DRIVER_NOTIFICATION_TO=build@example.com
ARG ZOHO_CLIENT_ID=build-zoho-client-id
ARG ZOHO_CLIENT_SECRET=build-zoho-client-secret
ARG ZOHO_REFRESH_TOKEN=build-zoho-refresh-token
ARG ZOHO_WORKDRIVE_DRIVER_FOLDER_ID=build-driver-folder-id
ARG ZOHO_WORKDRIVE_WAREHOUSE_FOLDER_ID=build-warehouse-folder-id
ENV DATABASE_URL=${DATABASE_URL}
ENV ZEPTOMAIL_SEND_TOKEN=${ZEPTOMAIL_SEND_TOKEN}
ENV ZEPTOMAIL_FROM_EMAIL=${ZEPTOMAIL_FROM_EMAIL}
ENV CONTACT_NOTIFICATION_TO=${CONTACT_NOTIFICATION_TO}
ENV DRIVER_NOTIFICATION_TO=${DRIVER_NOTIFICATION_TO}
ENV ZOHO_CLIENT_ID=${ZOHO_CLIENT_ID}
ENV ZOHO_CLIENT_SECRET=${ZOHO_CLIENT_SECRET}
ENV ZOHO_REFRESH_TOKEN=${ZOHO_REFRESH_TOKEN}
ENV ZOHO_WORKDRIVE_DRIVER_FOLDER_ID=${ZOHO_WORKDRIVE_DRIVER_FOLDER_ID}
ENV ZOHO_WORKDRIVE_WAREHOUSE_FOLDER_ID=${ZOHO_WORKDRIVE_WAREHOUSE_FOLDER_ID}
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
