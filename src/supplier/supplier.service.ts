
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateSupplierDto } from './dto/create-supplier.dto';

import { CreateReviewDto } from './dto/create-review.dto';



@Injectable()

export class SupplierService {

  constructor(private prisma: PrismaService) {}



  async create(userId: string, dto: CreateSupplierDto) {

    const existing = await this.prisma.supplier.findUnique({ where: { userId } });

    if (existing) throw new ConflictException('Supplier profile already exists');

    return this.prisma.supplier.create({

      data: { userId, name: dto.companyName },

    });

  }



  async findOne(userId: string) {

    const supplier = await this.prisma.supplier.findUnique({ where: { userId }, include: { equipment: true, reviews: { include: { user: true } } } });

    if (!supplier) throw new NotFoundException('Supplier profile not found');

    return supplier;

  }



  async update(userId: string, dto: Partial<CreateSupplierDto>) {

    const supplier = await this.prisma.supplier.findUnique({ where: { userId } });

    if (!supplier) throw new NotFoundException('Supplier profile not found');

    return this.prisma.supplier.update({ where: { userId }, data: { name: dto.companyName } });

  }



  async findAll() {

    return this.prisma.supplier.findMany({ include: { equipment: true } });

  }



  async addReview(supplierId: string, userId: string, dto: CreateReviewDto) {

    // Проверим, существует ли поставщик

    const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });

    if (!supplier) throw new NotFoundException('Supplier not found');



    // Добавим отзыв

    const review = await this.prisma.supplierReview.create({

      data: {

        supplierId,

        userId,

        rating: dto.rating,

        comment: dto.comment,

      },

    });



    // Пересчитаем средний рейтинг и количество отзывов

    const reviews = await this.prisma.supplierReview.findMany({

      where: { supplierId },

      select: { rating: true },

    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);

    const newRating = totalRating / reviews.length;

    await this.prisma.supplier.update({

      where: { id: supplierId },

      data: { rating: newRating, reviewCount: reviews.length },

    });



    return review;

  }



  async getReviews(supplierId: string) {

    const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });

    if (!supplier) throw new NotFoundException('Supplier not found');

    return this.prisma.supplierReview.findMany({

      where: { supplierId },

      include: { user: { select: { id: true, name: true } } },

      orderBy: { createdAt: 'desc' },

    });

  }

}

