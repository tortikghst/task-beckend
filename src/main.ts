
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);



  // Включаем CORS для фронтенда

  app.enableCors({

    origin: true,

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  });



  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());



  const config = new DocumentBuilder()

    .setTitle('GhostEvent API')

    .setDescription('API для аренды оборудования с JWT авторизацией')

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

