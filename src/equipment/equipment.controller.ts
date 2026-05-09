
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { EquipmentService } from './equipment.service';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';



@ApiTags('equipment')

@Controller('equipment')

export class EquipmentController {

  constructor(private readonly equipmentService: EquipmentService) {}



  @Get()

  @ApiOperation({ summary: 'Поиск оборудования', description: 'Возвращает список оборудования с возможностью фильтрации' })

  @ApiQuery({ name: 'city', required: false, description: 'Город', example: 'Москва' })

  @ApiQuery({ name: 'minPrice', required: false, description: 'Мин. цена', example: 10000 })

  @ApiQuery({ name: 'maxPrice', required: false, description: 'Макс. цена', example: 50000 })

  @ApiQuery({ name: 'search', required: false, description: 'Поиск по названию или описанию', example: 'микрофон' })

  @ApiQuery({ name: 'delivery', required: false, description: 'Только с доставкой', example: true })

  @ApiResponse({ status: 200, description: 'Список оборудования' })

  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })

  async findAll(@Query() query: any) {

    return this.equipmentService.findAll(query);

  }



  @Get(':id')

  @ApiOperation({ summary: 'Получить оборудование по ID' })

  @ApiParam({ name: 'id', description: 'UUID оборудования', example: 'clxxxxxxxxxxxxx' })

  @ApiResponse({ status: 200, description: 'Найдено' })

  @ApiResponse({ status: 404, description: 'Оборудование не найдено' })

  async findOne(@Param('id') id: string) {

    return this.equipmentService.findOne(id);

  }



  @Post()

  @UseGuards(AuthGuard('jwt'))

  @ApiBearerAuth('JWT-auth')

  @ApiOperation({ summary: 'Создать оборудование (только для поставщиков/администраторов)' })

  @ApiBody({ schema: { example: { name: 'Микрофон Shure', price: 15000, city: 'Москва', quantity: 5, deliveryAvailable: true } } })

  @ApiResponse({ status: 201, description: 'Создано' })

  @ApiResponse({ status: 401, description: 'Не авторизован' })

  async create(@Body() body: any) {

    return this.equipmentService.create(body);

  }



  @Put(':id')

  @UseGuards(AuthGuard('jwt'))

  @ApiBearerAuth('JWT-auth')

  @ApiOperation({ summary: 'Обновить оборудование' })

  @ApiParam({ name: 'id', description: 'UUID оборудования' })

  @ApiBody({ schema: { example: { price: 13000 } } })

  @ApiResponse({ status: 200, description: 'Обновлено' })

  async update(@Param('id') id: string, @Body() body: any) {

    return this.equipmentService.update(id, body);

  }



  @Delete(':id')

  @UseGuards(AuthGuard('jwt'))

  @ApiBearerAuth('JWT-auth')

  @HttpCode(HttpStatus.NO_CONTENT)

  @ApiOperation({ summary: 'Удалить оборудование' })

  @ApiParam({ name: 'id', description: 'UUID оборудования' })

  @ApiResponse({ status: 204, description: 'Удалено' })

  async remove(@Param('id') id: string) {

    return this.equipmentService.remove(id);

  }

}

