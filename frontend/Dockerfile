FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

# IMPORTANT: Vite needs these at BUILD TIME to bundle them into the JS
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN bun run build

EXPOSE 5173

CMD ["bun", "run", "dev", "--host"]