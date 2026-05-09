
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { FavoritesService } from './favorites.service';

import { AddFavoriteDto } from './dto/add-favorite.dto';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';



@ApiTags('favorites')

@ApiBearerAuth('JWT-auth')

@Controller('favorites')

export class FavoritesController {

  constructor(private readonly favoritesService: FavoritesService) {}



  @Post()

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Добавить оборудование в избранное' })

  @ApiBody({ type: AddFavoriteDto })

  @ApiResponse({ status: 201, description: 'Добавлено' })

  async add(@Request() req, @Body() dto: AddFavoriteDto) {

    return this.favoritesService.add(req.user.userId, dto.equipmentId);

  }



  @Delete(':equipmentId')

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Удалить оборудование из избранного' })

  @ApiParam({ name: 'equipmentId', description: 'UUID оборудования' })

  @ApiResponse({ status: 200, description: 'Удалено' })

  async remove(@Request() req, @Param('equipmentId') equipmentId: string) {

    return this.favoritesService.remove(req.user.userId, equipmentId);

  }



  @Get()

  @UseGuards(AuthGuard('jwt'))

  @ApiOperation({ summary: 'Получить список избранного' })

  @ApiResponse({ status: 200, description: 'Список избранного оборудования' })

  async findAll(@Request() req) {

    return this.favoritesService.findAll(req.user.userId);

  }

}

