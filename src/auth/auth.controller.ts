
import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { AuthService } from './auth.service';



@ApiTags('auth')

@Controller('auth')

export class AuthController {

  constructor(private authService: AuthService) {}



  @Post('register')

  @HttpCode(HttpStatus.CREATED)

  @ApiOperation({ summary: 'Регистрация нового пользователя', description: 'Создаёт пользователя и возвращает JWT-токен' })

  @ApiBody({ schema: { example: { email: 'user@example.com', password: '123456', name: 'Иван Иванов' } } })

  @ApiResponse({ status: 201, description: 'Пользователь зарегистрирован', schema: { example: { access_token: 'eyJ...', user: { id: '...', email: 'user@example.com', name: 'Иван Иванов' } } } })

  @ApiResponse({ status: 400, description: 'Неверные данные' })

  @ApiResponse({ status: 409, description: 'Email уже существует' })

  async register(@Body() body: { email: string; password: string; name: string }) {

    return this.authService.register(body.email, body.password, body.name);

  }



  @Post('login')

  @HttpCode(HttpStatus.OK)

  @ApiOperation({ summary: 'Вход в систему', description: 'Аутентификация пользователя, возвращает JWT-токен' })

  @ApiBody({ schema: { example: { email: 'user@example.com', password: '123456' } } })

  @ApiResponse({ status: 200, description: 'Успешный вход', schema: { example: { access_token: 'eyJ...', user: { id: '...', email: 'user@example.com', name: 'Иван Иванов' } } } })

  @ApiResponse({ status: 401, description: 'Неверные учётные данные' })

  async login(@Body() body: { email: string; password: string }) {

    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.authService.login(user);

  }

}

