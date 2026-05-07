import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // Создание задачи (userId из токена)
  async create(userId: number, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });
  }

  // Получение всех задач пользователя
  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Вспомогательный метод: найти задачу и проверить владельца
  private async findTaskOrFail(userId: number, taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new ForbiddenException('You do not own this task');
    }
    return task;
  }

  // Получить одну задачу (с проверкой владельца)
  async findOne(userId: number, id: number) {
    return this.findTaskOrFail(userId, id);
  }

  // Обновление задачи (произвольные поля, используется PUT или PATCH)
  async update(userId: number, id: number, updateTaskDto: UpdateTaskDto) {
    await this.findTaskOrFail(userId, id);
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  // Специальный метод для PUT /tasks/:id (обновление только title/description)
  async updateTaskFields(
    userId: number,
    id: number,
    data: { title?: string; description?: string }
  ) {
    const task = await this.findTaskOrFail(userId, id);
    return this.prisma.task.update({
      where: { id },
      data: {
        title: data.title ?? task.title,
        description: data.description ?? task.description,
      },
    });
  }

  // Переключение статуса completed (PATCH /tasks/:id/complete)
  async toggleComplete(userId: number, id: number) {
    const task = await this.findTaskOrFail(userId, id);
    return this.prisma.task.update({
      where: { id },
      data: { isCompleted: !task.isCompleted },
    });
  }

  // Удаление задачи
  async remove(userId: number, id: number) {
    await this.findTaskOrFail(userId, id);
    await this.prisma.task.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }
}