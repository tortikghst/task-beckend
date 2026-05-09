
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);



  // CORS для фронтенда

  app.enableCors({

    origin: true,

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  });



  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());



  const config = new DocumentBuilder()

    .setTitle('GhostEvent API')

    .setDescription(`

## Платформа для аренды оборудования для мероприятий



GhostEvent помогает организаторам мероприятий быстро находить и арендовать оборудование: от звукового и светового до мебели и декора.



### Основные возможности

- **Аутентификация** – регистрация, вход, JWT-токены.

- **Оборудование** – создание, редактирование, удаление, поиск с фильтрацией (город, цена, доставка, текстовый поиск).

- **Заказы** – создание заказа, просмотр, изменение статуса (CREATED → PENDING → CONFIRMED → IN_PROGRESS → COMPLETED / CANCELLED).

- **Избранное** – добавление/удаление оборудования в избранное, просмотр списка.

- **Категории** – управление категориями (только для админа).

- **Пользователи** – просмотр профиля, изменение ролей (админ).



### Аутентификация

Для доступа к защищённым эндпоинтам (создание оборудования, заказы, избранное) требуется JWT-токен.

1. Зарегистрируйтесь через \`POST /api/auth/register\`.

2. Войдите через \`POST /api/auth/login\`, скопируйте \`access_token\`.

3. Нажмите кнопку **Authorize** вверху страницы и введите: \`Bearer ваш_токен\`.



### Примеры запросов

- **Получить оборудование в Москве с ценой от 10000 до 50000:**  

  \`GET /api/equipment?city=Москва&minPrice=10000&maxPrice=50000\`

- **Найти микрофон:**  

  \`GET /api/equipment?search=микрофон\`

- **Создать заказ** (требуется токен):  

  \`POST /api/orders\` с телом:

  \`\`\`json

  {

    "items": [

      { "equipmentId": "clxxx", "quantity": 2, "startDate": "2025-06-10", "endDate": "2025-06-12" }

    ],

    "eventType": "CONFERENCE",

    "eventCity": "Москва"

  }

  \`\`\`

`)

    .setVersion('1.0')

    .addBearerAuth()

    .addTag('auth', 'Аутентификация и регистрация')

    .addTag('equipment', 'Оборудование (поиск, фильтрация, CRUD)')

    .addTag('orders', 'Заказы (создание, просмотр, статусы)')

    .addTag('favorites', 'Избранное оборудование')

    .addTag('categories', 'Категории оборудования (только админ)')

    .addTag('users', 'Пользователи (профиль, роли)')

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

