
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateSupplierDto } from './dto/create-supplier.dto';



@Injectable()

export class SupplierService {

  constructor(private prisma: PrismaService) {}



  async create(userId: string, dto: CreateSupplierDto) {

    const existing = await this.prisma.supplier.findUnique({ where: { userId } });

    if (existing) throw new ConflictException('Supplier profile already exists');

    return this.prisma.supplier.create({

      data: { userId, ...dto },

    });

  }



  async findOne(userId: string) {

    const supplier = await this.prisma.supplier.findUnique({ where: { userId }, include: { equipment: true } });

    if (!supplier) throw new NotFoundException('Supplier profile not found');

    return supplier;

  }



  async update(userId: string, dto: Partial<CreateSupplierDto>) {

    const supplier = await this.prisma.supplier.findUnique({ where: { userId } });

    if (!supplier) throw new NotFoundException('Supplier profile not found');

    return this.prisma.supplier.update({ where: { userId }, data: dto });

  }



  async findAll() {

    return this.prisma.supplier.findMany({ include: { equipment: true } });

  }

}

