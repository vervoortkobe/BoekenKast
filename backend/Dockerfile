FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

ENV DATABASE_URL="file:./dev.db"
RUN bun prisma generate

RUN bun run build

EXPOSE 3000

CMD ["sh", "-c", "bun prisma migrate deploy && bun run start:prod"]