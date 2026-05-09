import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Упрощённое создание заказа – без проверки доступности и расчёта цены
    const order = await this.prisma.order.create({
      data: {
        userId,
        total: 0,
        items: {
          create: dto.items.map(item => ({
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            price: 0,
          })),
        },
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
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { equipment: true } } },
    });
  }

  async autoCancelOldOrders(minutes: number = 15) {
    // Упрощённая заглушка
    return { cancelled: 0 };
  }
}
