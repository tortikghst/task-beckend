
import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';

import { UsersModule } from './users/users.module';

import { EquipmentModule } from './equipment/equipment.module';

import { OrdersModule } from './orders/orders.module';



@Module({

  imports: [PrismaModule, AuthModule, UsersModule, EquipmentModule, OrdersModule],

})

export class AppModule {}

