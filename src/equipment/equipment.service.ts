
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



    if (city) where.city = { contains: city, mode: 'insensitive' };

    if (minPrice !== undefined || maxPrice !== undefined) {

      where.price = {};

      if (minPrice !== undefined) where.price.gte = Number(minPrice);

      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);

    }

    if (delivery !== undefined) where.deliveryAvailable = delivery;

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

    return this.prisma.equipment.create({ data });

  }



  async update(id: string, data: any) {

    return this.prisma.equipment.update({ where: { id }, data });

  }



  async remove(id: string) {

    return this.prisma.equipment.delete({ where: { id } });

  }



  async findRandom(limit: number = 6) {

    const count = await this.prisma.equipment.count();

    const skip = Math.max(0, Math.floor(Math.random() * count));

    return this.prisma.equipment.findMany({ take: limit, skip });

  }

}

