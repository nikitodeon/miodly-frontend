FROM node:20.17.0-alpine AS base

# Установка Bun и зависимостей
RUN apk add --no-cache curl bash git python3 make g++
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /app

# Копируем только файлы зависимостей сначала
COPY package.json bun.lockb ./

# Устанавливаем зависимости с явным флагом
RUN bun install --legacy-peer-deps

# Копируем остальные файлы
COPY . .

# Запускаем генерацию кода и сборку
RUN bun run graphql-codegen --config graphql.config.ts
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]