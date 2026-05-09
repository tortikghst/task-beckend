
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());



  const config = new DocumentBuilder()

    .setTitle('GhostEvent API')

    .setVersion('1.0')

    .setDescription(`

## 🎯 Добро пожаловать в API GhostEvent!



GhostEvent — платформа для аренды оборудования для мероприятий. API предоставляет полный доступ к функционалу.



### 🔑 Основные возможности:

* **👤 Аутентификация и пользователи:** Регистрация, вход, управление профилем и ролями.

* **🎸 Оборудование:** Полный CRUD для управления каталогом с гибкой системой фильтрации.

* **📦 Заказы:** Создание, просмотр и обновление статуса заказов.

* **❤️ Избранное:** Добавление и удаление оборудования из личного списка.

* **📂 Категории:** Управление категориями оборудования (только администратор).



### 🔐 Аутентификация:

* Для доступа к защищённым эндпоинтам требуется JWT-токен.

* Получить токен можно через \`POST /api/auth/login\`.

* Используйте кнопку **Authorize** для вставки токена в формате \`Bearer <ваш_токен>\`.

`)

    .addBearerAuth(

      {

        type: 'http',

        scheme: 'bearer',

        bearerFormat: 'JWT',

        name: 'JWT',

        description: 'Введите ваш JWT токен',

        in: 'header',

      },

      'JWT-auth',

    )

    .addTag('auth', '🔐 Аутентификация и регистрация')

    .addTag('users', '👤 Управление пользователями')

    .addTag('equipment', '🎸 Оборудование и поиск')

    .addTag('categories', '📂 Категории оборудования')

    .addTag('orders', '📦 Заказы и бронирования')

    .addTag('favorites', '❤️ Избранное')

    .build();



  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {

    swaggerOptions: {

      persistAuthorization: true,

      tagsSorter: 'alpha',

      operationsSorter: 'alpha',

    },

    customSiteTitle: 'GhostEvent API Documentation',

  });



  await app.listen(3000);

}

bootstrap();

