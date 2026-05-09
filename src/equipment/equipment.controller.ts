import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EquipmentService } from './equipment.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @ApiOperation({ summary: 'Получить всё оборудование' })
  async findAll(@Query() query: any) {
    return this.equipmentService.findAll(query);
  }

  @Get('random')
  @ApiOperation({ summary: 'Случайное оборудование' })
  @ApiQuery({ name: 'limit', required: false, example: 6 })
  async random(@Query('limit') limit?: number) {
    return this.equipmentService.findRandom(limit || 6);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить оборудование по ID' })
  async findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать оборудование' })
  async create(@Body() body: any) {
    return this.equipmentService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить оборудование' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.equipmentService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить оборудование' })
  async remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }
}
