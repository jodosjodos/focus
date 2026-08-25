FROM node:22-bookworm-slim

RUN corepack enable && corepack prepare pnpm@11.20.0 --activate

WORKDIR /app

EXPOSE 8081

CMD ["npx", "expo", "start", "--dev-client", "--host", "lan"]
