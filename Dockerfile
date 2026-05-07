# ---- Стадия сборки ----
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы с зависимостями
COPY package*.json ./
# Устанавливаем ВСЕ зависимости (включая dev)
RUN npm ci

# Копируем исходники и Prisma-схему
COPY prisma ./prisma
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем NestJS (создаст папку dist)
RUN npm run build

# ---- Стадия production ----
FROM node:20-alpine

WORKDIR /app

# Копируем только production-зависимости из стадии сборки
COPY --from=builder /app/node_modules ./node_modules
# Копируем собранный проект
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Открываем порт
EXPOSE 3000

# Запускаем миграции и приложение
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]