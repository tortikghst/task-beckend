import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EquipmentModule } from './equipment/equipment.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { SupplierModule } from './supplier/supplier.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    EquipmentModule,
    OrdersModule,
    CategoriesModule,
    SupplierModule,
    FavoritesModule,
  ],
})
export class AppModule {}
