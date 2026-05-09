
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';



@Injectable()

export class OrdersService {

  constructor(private prisma: PrismaService) {}



  async create(userId: string, dto: CreateOrderDto) {

    for (const item of dto.items) {

      const start = new Date(item.startDate);

      const end = new Date(item.endDate);



      // Проверка: есть ли уже заказ с таким же оборудованием на пересекающиеся даты и не отменённый

      const existing = await this.prisma.orderItem.findFirst({

        where: {

          equipmentId: item.equipmentId,

          startDate: { lte: end },

          endDate: { gte: start },

          order: {

            status: { not: 'CANCELLED' }

          }

        },

        include: { order: true }

      });



      if (existing) {

        throw new ConflictException(`Equipment ${item.equipmentId} is already booked for the selected dates`);

      }

    }



    // Расчёт стоимости и создание заказа

    let totalPrice = 0;

    const itemsData = [];

    for (const item of dto.items) {

      const equipment = await this.prisma.equipment.findUnique({ where: { id: item.equipmentId } });

      if (!equipment) throw new NotFoundException(`Equipment ${item.equipmentId} not found`);

      const days = Math.ceil((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 3600 * 24)) + 1;

      const itemTotal = equipment.price * item.quantity * days;

      totalPrice += itemTotal;

      itemsData.push({

        equipmentId: item.equipmentId,

        quantity: item.quantity,

        price: equipment.price,

        startDate: new Date(item.startDate),

        endDate: new Date(item.endDate),

        totalPrice: itemTotal,

      });

    }



    const order = await this.prisma.order.create({

      data: {

        userId,

        total: totalPrice,

        items: { create: itemsData },

        eventType: dto.eventType,

        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,

        eventCity: dto.eventCity,

      },

      include: { items: { include: { equipment: true } } },

    });

    return order;

  }



  async findAll(userId: string) {

    return this.prisma.order.findMany({

      where: { userId },

      include: { items: { include: { equipment: true } } },

      orderBy: { createdAt: 'desc' },

    });

  }



  async findOne(id: string, userId: string) {

    const order = await this.prisma.order.findFirst({

      where: { id, userId },

      include: { items: { include: { equipment: true } } },

    });

    if (!order) throw new NotFoundException('Order not found');

    return order;

  }



  async updateStatus(id: string, userId: string, status: string) {

    await this.findOne(id, userId);

    return this.prisma.order.update({

      where: { id },

      data: { status },

      include: { items: { include: { equipment: true } } },

    });

  }



  async autoCancelOldOrders(minutes: number = 15) {

    const deadline = new Date(Date.now() - minutes * 60000);

    const orders = await this.prisma.order.updateMany({

      where: {

        status: { in: ['CREATED', 'PENDING_PAYMENT'] },

        createdAt: { lt: deadline },

      },

      data: { status: 'CANCELLED' },

    });

    return { cancelled: orders.count };

  }

}

