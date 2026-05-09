
import { Controller, Get, Post, Put, Body, UseGuards, Request, Param } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { SupplierService } from './supplier.service';

import { CreateSupplierDto } from './dto/create-supplier.dto';

import { CreateReviewDto } from './dto/create-review.dto';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';



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



  @Post(':id/review')

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Добавить отзыв о поставщике' })

  @ApiParam({ name: 'id', description: 'ID поставщика' })

  @ApiBody({ type: CreateReviewDto })

  async addReview(@Param('id') id: string, @Request() req, @Body() dto: CreateReviewDto) {

    return this.supplierService.addReview(id, req.user.userId, dto);

  }



  @Get(':id/reviews')

  @ApiOperation({ summary: 'Получить все отзывы о поставщике' })

  @ApiParam({ name: 'id', description: 'ID поставщика' })

  async getReviews(@Param('id') id: string) {

    return this.supplierService.getReviews(id);

  }

}

