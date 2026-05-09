
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';

import { UpdateCategoryDto } from './dto/update-category.dto';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';



@ApiTags('categories')

@Controller('categories')

export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) {}



  @Post()

  @UseGuards(AuthGuard('jwt'))

  @ApiBearerAuth()

  @ApiOperation({ summary: 'Создать категорию (только для админа)' })

  @ApiResponse({ status: 201, description: 'Категория создана' })

  create(@Body() dto: CreateCategoryDto) {

    return this.categoriesService.create(dto);

  }



  @Get()

  @ApiOperation({ summary: 'Получить все категории' })

  findAll() {

    return this.categoriesService.findAll();

  }



  @Get(':id')

  @ApiOperation({ summary: 'Получить категорию по ID' })

  findOne(@Param('id') id: string) {

    return this.categoriesService.findOne(id);

  }



  @Put(':id')

  @UseGuards(AuthGuard('jwt'))

  @ApiBearerAuth()

  @ApiOperation({ summary: 'Обновить категорию (только для админа)' })

  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {

    return this.categoriesService.update(id, dto);

  }



  @Delete(':id')

  @UseGuards(AuthGuard('jwt'))

  @ApiBearerAuth()

  @ApiOperation({ summary: 'Удалить категорию (только для админа)' })

  remove(@Param('id') id: string) {

    return this.categoriesService.remove(id);

  }

}

