
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';



@Injectable()

export class EquipmentService {

  constructor(private prisma: PrismaService) {}



  async findAll(filters: {

    city?: string;

    minPrice?: number;

    maxPrice?: number;

    search?: string;

    delivery?: boolean;

  }) {

    const { city, minPrice, maxPrice, search, delivery } = filters;

    const where: any = {};



    if (city) {

      where.city = { contains: city, mode: 'insensitive' };

    }

    if (minPrice !== undefined) {

      where.price = { gte: minPrice };

    }

    if (maxPrice !== undefined) {

      where.price = { ...where.price, lte: maxPrice };

    }

    if (delivery !== undefined) {

      where.deliveryAvailable = delivery;

    }

    if (search) {

      where.OR = [

        { name: { contains: search, mode: 'insensitive' } },

        { description: { contains: search, mode: 'insensitive' } },

      ];

    }



    return this.prisma.equipment.findMany({ where });

  }



  async findOne(id: string) {

    return this.prisma.equipment.findUnique({ where: { id } });

  }



  async create(data: any) {

    // Проверяем, есть ли хотя бы один пользователь. Если нет – создаём тестового.

    let user = await this.prisma.user.findFirst();

    if (!user) {

      user = await this.prisma.user.create({

        data: {

          email: 'default@example.com',

          password: '$2b$10$defaultpassword',

          name: 'Default User',

          role: 'CLIENT'

        }

      });

    }

    return this.prisma.equipment.create({ data: { ...data, userId: user.id } });

  }



  async update(id: string, data: any) {

    return this.prisma.equipment.update({ where: { id }, data });

  }



  async remove(id: string) {

    return this.prisma.equipment.delete({ where: { id } });

  }

}

