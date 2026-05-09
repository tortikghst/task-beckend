
import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { OrdersService } from './orders.service';

import { CreateOrderDto } from './dto/create-order.dto';

import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';



@ApiTags('orders')

@ApiBearerAuth('JWT-auth')

@Controller('orders')

export class OrdersController {

  constructor(private readonly ordersService: OrdersService) {}



  @Post()

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Создать заказ', description: 'Создаёт заказ на аренду оборудования' })

  @ApiBody({ type: CreateOrderDto, description: 'Данные заказа' })

  @ApiResponse({ status: 201, description: 'Заказ создан' })

  @ApiResponse({ status: 401, description: 'Не авторизован' })

  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {

    const userId = req.user?.userId || '1';

    return this.ordersService.create(userId, createOrderDto);

  }



  @Get()

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Получить все заказы пользователя', description: 'Возвращает список заказов текущего пользователя' })

  @ApiResponse({ status: 200, description: 'Список заказов' })

  async findAll(@Request() req) {

    const userId = req.user?.userId || '1';

    return this.ordersService.findAll(userId);

  }



  @Get(':id')

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Получить заказ по ID' })

  @ApiParam({ name: 'id', description: 'UUID заказа' })

  @ApiResponse({ status: 200, description: 'Данные заказа' })

  async findOne(@Param('id') id: string, @Request() req) {

    const userId = req.user?.userId || '1';

    return this.ordersService.findOne(id, userId);

  }



  @Patch(':id/status')

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Обновить статус заказа', description: 'Изменяет статус заказа (например, на "CONFIRMED")' })

  @ApiParam({ name: 'id', description: 'UUID заказа' })

  @ApiBody({ type: UpdateOrderStatusDto })

  @ApiResponse({ status: 200, description: 'Статус обновлён' })

  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto, @Request() req) {

    const userId = req.user?.userId || '1';

    return this.ordersService.updateStatus(id, userId, updateStatusDto.status);

  }

}

