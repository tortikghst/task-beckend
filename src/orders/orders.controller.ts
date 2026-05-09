
import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { OrdersService } from './orders.service';

import { CreateOrderDto } from './dto/create-order.dto';

import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';



@ApiTags('orders')

@ApiBearerAuth()

@Controller('orders')

export class OrdersController {

  constructor(private readonly ordersService: OrdersService) {}



  @UseGuards(AuthGuard('jwt'))

  @Post()

  @ApiOperation({ summary: 'Создать заказ' })

  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {

    const userId = req.user?.userId || '1';

    return this.ordersService.create(userId, createOrderDto);

  }



  @UseGuards(AuthGuard('jwt'))

  @Get()

  @ApiOperation({ summary: 'Получить все заказы пользователя' })

  findAll(@Request() req) {

    const userId = req.user?.userId || '1';

    return this.ordersService.findAll(userId);

  }



  @UseGuards(AuthGuard('jwt'))

  @Get(':id')

  @ApiOperation({ summary: 'Получить заказ по ID' })

  findOne(@Param('id') id: string, @Request() req) {

    const userId = req.user?.userId || '1';

    return this.ordersService.findOne(id, userId);

  }



  @UseGuards(AuthGuard('jwt'))

  @Patch(':id/status')

  @ApiOperation({ summary: 'Обновить статус заказа' })

  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto, @Request() req) {

    const userId = req.user?.userId || '1';

    return this.ordersService.updateStatus(id, userId, updateStatusDto.status);

  }



  // Админский эндпоинт для ручного запуска автоотмены (можно через Cron)

  @Post('auto-cancel')

  @ApiOperation({ summary: 'Автоматическая отмена старых заказов (админ)' })

  async autoCancel() {

    return this.ordersService.autoCancelExpiredOrders(24);

  }

}

