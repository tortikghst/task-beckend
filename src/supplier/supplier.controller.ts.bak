
import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { SupplierService } from './supplier.service';

import { CreateSupplierDto } from './dto/create-supplier.dto';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';



@ApiTags('supplier')

@ApiBearerAuth()

@Controller('supplier')

export class SupplierController {

  constructor(private readonly supplierService: SupplierService) {}



  @Post('profile')

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Создать профиль поставщика' })

  async createProfile(@Request() req, @Body() dto: CreateSupplierDto) {

    return this.supplierService.create(req.user.userId, dto);

  }



  @Get('profile')

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Получить профиль поставщика' })

  async getProfile(@Request() req) {

    return this.supplierService.findOne(req.user.userId);

  }



  @Put('profile')

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Обновить профиль поставщика' })

  async updateProfile(@Request() req, @Body() dto: Partial<CreateSupplierDto>) {

    return this.supplierService.update(req.user.userId, dto);

  }



  @Get()

  @ApiOperation({ summary: 'Список всех поставщиков' })

  async findAll() {

    return this.supplierService.findAll();

  }

}

