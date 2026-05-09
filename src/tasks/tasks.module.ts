
import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';

import { TasksService } from './tasks.service';

import { OrdersModule } from '../orders/orders.module';



@Module({

  imports: [ScheduleModule.forRoot(), OrdersModule],

  providers: [TasksService],

})

export class TasksModule {}

