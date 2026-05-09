
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';



@Injectable()

export class FavoritesService {

  constructor(private prisma: PrismaService) {}



  async add(userId: string, equipmentId: string) {

    // Проверяем, существует ли оборудование

    const equipment = await this.prisma.equipment.findUnique({ where: { id: equipmentId } });

    if (!equipment) throw new NotFoundException('Equipment not found');



    // Добавляем в избранное

    try {

      return await this.prisma.favorite.create({

        data: { userId, equipmentId },

        include: { equipment: true },

      });

    } catch (error) {

      if (error.code === 'P2002') throw new ConflictException('Already in favorites');

      throw error;

    }

  }



  async remove(userId: string, equipmentId: string) {

    // Ищем запись в избранном

    const favorite = await this.prisma.favorite.findUnique({

      where: { userId_equipmentId: { userId, equipmentId } },

    });

    if (!favorite) throw new NotFoundException('Favorite not found');



    // Удаляем её

    return this.prisma.favorite.delete({ where: { id: favorite.id } });

  }



  async findAll(userId: string) {

    // Возвращаем все записи избранного для пользователя

    return this.prisma.favorite.findMany({

      where: { userId },

      include: { equipment: true },

      orderBy: { createdAt: 'desc' },

    });

  }

}

