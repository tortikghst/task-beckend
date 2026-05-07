FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
<<<<<<< HEAD
RUN npm install
=======
# Устанавливаем ВСЕ зависимости (включая dev)
RUN npm install

# Копируем исходники и Prisma-схему
>>>>>>> 5d4e1baea92b01b301438dab55b6393db4da41b8
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
<<<<<<< HEAD
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
=======

# Запускаем миграции и приложение
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
>>>>>>> 5d4e1baea92b01b301438dab55b6393db4da41b8
