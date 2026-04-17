FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

# RUN bun prisma generate
RUN bun run build

EXPOSE 3000

# CMD ["bun", "prisma", "migrate", "deploy"]
CMD ["bun", "run", "start:prod"]