
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';



@Injectable()

export class OrdersService {

  constructor(private prisma: PrismaService) {}



  // Проверка доступности оборудования на даты

  private async checkAvailability(equipmentId: string, startDate: Date, endDate: Date, requestedQty: number): Promise<void> {

    // Находим все заказы, включающие это оборудование, с пересекающимися датами

    const conflictingOrders = await this.prisma.orderItem.findMany({

      where: {

        equipmentId,

        AND: [

          { startDate: { lte: endDate } },

          { endDate: { gte: startDate } },

        ],

      },

      include: { order: true },

    });

    // Суммируем забронированное количество

    let booked = 0;

    for (const item of conflictingOrders) {

      if (item.order.status !== 'CANCELLED') {

        booked += item.quantity;

      }

    }

    const equipment = await this.prisma.equipment.findUnique({ where: { id: equipmentId } });

    if (!equipment) throw new NotFoundException('Equipment not found');

    const available = equipment.available - booked;

    if (available < requestedQty) {

      throw new BadRequestException(`Not enough equipment available for selected dates. Available: ${available}`);

    }

  }



  async create(userId: string, dto: CreateOrderDto) {

    let totalPrice = 0;

    const itemsData: {

      equipmentId: string;

      quantity: number;

      priceAtTime: number;

      startDate: Date;

      endDate: Date;

      totalPrice: number;

    }[] = [];



    for (const item of dto.items) {

      const equipment = await this.prisma.equipment.findUnique({ where: { id: item.equipmentId } });

      if (!equipment) throw new NotFoundException(`Equipment ${item.equipmentId} not found`);

      

      const start = new Date(item.startDate);

      const end = new Date(item.endDate);

      await this.checkAvailability(item.equipmentId, start, end, item.quantity);

      

      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

      const itemTotal = equipment.price * item.quantity * days;

      totalPrice += itemTotal;

      itemsData.push({

        equipmentId: item.equipmentId,

        quantity: item.quantity,

        priceAtTime: equipment.price,

        startDate: start,

        endDate: end,

        totalPrice: itemTotal,

      });

    }



    const order = await this.prisma.order.create({

      data: {

        userId,

        totalPrice,

        eventType: dto.eventType,

        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,

        eventCity: dto.eventCity,

        items: { create: itemsData },

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

    const order = await this.findOne(id, userId);

    // Допустимые переходы статусов (упрощённо, но можно расширить)

    const validTransitions: Record<string, string[]> = {

      CREATED: ['PENDING_PAYMENT', 'CANCELLED'],

      PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],

      CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],

      IN_PROGRESS: ['COMPLETED'],

      COMPLETED: [],

      CANCELLED: [],

    };

    if (!validTransitions[order.status]?.includes(status)) {

      throw new BadRequestException(`Invalid status transition from ${order.status} to ${status}`);

    }

    return this.prisma.order.update({

      where: { id },

      data: { status },

      include: { items: { include: { equipment: true } } },

    });

  }



  // Автоматическая отмена заказов через заданное время (можно вызывать по расписанию)

  async autoCancelExpiredOrders(minutes: number = 30) {

    const threshold = new Date(Date.now() - minutes * 60 * 1000);

    const expiredOrders = await this.prisma.order.findMany({

      where: {

        status: 'CREATED',

        createdAt: { lt: threshold },

      },

    });

    for (const order of expiredOrders) {

      await this.prisma.order.update({

        where: { id: order.id },

        data: { status: 'CANCELLED' },

      });

    }

    return expiredOrders.length;

  }

}

