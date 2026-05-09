
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));



  const config = new DocumentBuilder()

    .setTitle('GhostEvent API')

    .setDescription(`

## 🎯 Платформа для аренды оборудования для мероприятий



GhostEvent помогает организаторам мероприятий быстро находить и арендовать оборудование.



### 🔐 Аутентификация

- **POST /auth/register** – регистрация нового пользователя

- **POST /auth/login** – вход, получение JWT токена



### 🎸 Оборудование

- **GET /equipment** – получение списка с фильтрацией (city, minPrice, maxPrice, search, delivery, categoryId)

- **GET /equipment/random** – случайное оборудование

- **GET /equipment/:id** – детали

- **POST /equipment** – создать (только для поставщиков/админов)

- **PUT /equipment/:id** – обновить

- **DELETE /equipment/:id** – удалить



### 📦 Заказы (требуют JWT)

- **POST /orders** – создать заказ (проверка конфликта дат)

- **GET /orders** – список заказов пользователя

- **GET /orders/:id** – детали заказа

- **PATCH /orders/:id/status** – изменить статус

- **POST /orders/auto-cancel** – отменить старые заказы



### ❤️ Избранное (JWT)

- **POST /favorites** – добавить в избранное

- **DELETE /favorites/:equipmentId** – удалить

- **GET /favorites** – список



### 📂 Категории

- **GET /categories** – список всех категорий

- **POST /categories** – создать (админ)

- **PUT /categories/:id** – обновить (админ)

- **DELETE /categories/:id** – удалить (админ)



### 🏢 Поставщики

- **GET /supplier** – список поставщиков

- **POST /supplier/profile** – создать профиль (JWT, роль SUPPLIER)

- **GET /supplier/profile** – мой профиль

- **PUT /supplier/profile** – обновить профиль

- **POST /supplier/:id/review** – оставить отзыв (JWT)

- **GET /supplier/:id/reviews** – отзывы о поставщике



### 👤 Пользователи

- **GET /users/me** – профиль

- **PUT /users/me** – обновить профиль

- **POST /users/me/change-password** – смена пароля

- **(Админ)** GET /users, PUT /users/:id/role



### 📌 Примеры запросов



**Регистрация:**

\`\`\`json

POST /auth/register

{

  "email": "user@example.com",

  "password": "123456",

  "name": "Иван"

}

\`\`\`



**Поиск оборудования:**

\`/equipment?city=Москва&minPrice=10000&search=микрофон\`



**Создание заказа:**

\`\`\`json

POST /orders

Authorization: Bearer <token>

{

  "items": [

    {

      "equipmentId": "cmoyk9wl3003mja797rwi1ka7",

      "quantity": 2,

      "startDate": "2025-06-10",

      "endDate": "2025-06-12"

    }

  ],

  "eventType": "CONFERENCE",

  "eventCity": "Москва"

}

\`\`\`

`)

    .setVersion('1.0')

    .addBearerAuth()

    .build();



  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {

    swaggerOptions: {

      persistAuthorization: true,

      tryItOutEnabled: true,

    },

  });



  await app.listen(3000);

}

bootstrap();

