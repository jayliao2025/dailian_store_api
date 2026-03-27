FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile=false

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]
