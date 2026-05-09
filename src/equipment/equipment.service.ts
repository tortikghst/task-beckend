
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

    // Строим безопасный SQL-запрос

    let sql = 'SELECT * FROM "Equipment" WHERE 1=1';

    const params: any[] = [];



    if (city) {

      sql += ` AND city ILIKE $${params.length + 1}`;

      params.push(`%${city}%`);

    }

    if (minPrice !== undefined) {

      sql += ` AND price >= $${params.length + 1}`;

      params.push(Number(minPrice)); // Явно преобразуем в число

    }

    if (maxPrice !== undefined) {

      sql += ` AND price <= $${params.length + 1}`;

      params.push(Number(maxPrice));

    }

    if (delivery !== undefined) {

      sql += ` AND "deliveryAvailable" = $${params.length + 1}`;

      params.push(delivery);

    }

    if (search) {

      sql += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 2})`;

      params.push(`%${search}%`, `%${search}%`);

    }



    // Выполняем сырой запрос

    return this.prisma.$queryRawUnsafe(sql, ...params);

  }



  async findOne(id: string) {

    return this.prisma.equipment.findUnique({ where: { id } });

  }



  async create(data: any) {

    // Убедимся, что цена — число

    if (data.price !== undefined) data.price = Number(data.price);

    return this.prisma.equipment.create({ data });

  }



  async update(id: string, data: any) {

    if (data.price !== undefined) data.price = Number(data.price);

    return this.prisma.equipment.update({ where: { id }, data });

  }



  async remove(id: string) {

    return this.prisma.equipment.delete({ where: { id } });

  }

}

