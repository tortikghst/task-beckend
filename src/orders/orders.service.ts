import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    let total = 0;
    const itemsData = [];
    for (const item of dto.items) {
      const equipment = await this.prisma.equipment.findUnique({ where: { id: item.equipmentId } });
      if (!equipment) throw new NotFoundException(`Equipment ${item.equipmentId} not found`);
      const itemPrice = equipment.price * item.quantity;
      total += itemPrice;
      itemsData.push({
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        price: itemPrice,
      });
    }
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
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
    await this.findOne(id, userId);
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { equipment: true } } },
    });
  }

  async autoCancelOldOrders(minutes: number = 15) {
    const deadline = new Date(Date.now() - minutes * 60000);
    const result = await this.prisma.order.updateMany({
      where: {
        status: { in: ['CREATED', 'PENDING_PAYMENT'] },
        createdAt: { lt: deadline },
      },
      data: { status: 'CANCELLED' },
    });
    return { cancelled: result.count };
  }
}
