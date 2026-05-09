
import { Injectable, Logger } from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';

import { OrdersService } from '../orders/orders.service';



@Injectable()

export class TasksService {

  private readonly logger = new Logger(TasksService.name);



  constructor(private readonly ordersService: OrdersService) {}



  // Запуск каждые 10 минут (можно изменить интервал)

  @Cron(CronExpression.EVERY_10_MINUTES)

  async handleAutoCancelOrders() {

    this.logger.log('Запуск автоматической отмены старых заказов...');

    try {

      const result = await this.ordersService.autoCancelOldOrders(15); // отменяем заказы старше 15 минут

      if (result.cancelled > 0) {

        this.logger.log(`Отменено заказов: ${result.cancelled}`);

      } else {

        this.logger.log('Нет заказов для отмены');

      }

    } catch (error) {

      this.logger.error(`Ошибка при автоматической отмене: ${error.message}`);

    }

  }

}

