import { Controller, Get, Post, Body, Put, Patch, Param, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Создать новую задачу' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Задача создана', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все задачи текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Список задач', type: [TaskResponseDto] })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findAll(@Request() req) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить задачу по ID' })
  @ApiParam({ name: 'id', example: '1', description: 'ID задачи' })
  @ApiResponse({ status: 200, description: 'Задача найдена', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён (чужая задача)' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.userId, +id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить задачу (только title/description)' })
  @ApiParam({ name: 'id', example: '1', description: 'ID задачи' })
  @ApiBody({ schema: { example: { title: 'Новое название', description: 'Новое описание' } } })
  @ApiResponse({ status: 200, description: 'Задача обновлена', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён (чужая задача)' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async updateTaskFields(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string }
  ) {
    return this.tasksService.updateTaskFields(req.user.userId, +id, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Частичное обновление задачи' })
  @ApiParam({ name: 'id', example: '1', description: 'ID задачи' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Задача обновлена', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён (чужая задача)' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async update(@Request() req, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(req.user.userId, +id, updateTaskDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Переключить статус выполнения задачи' })
  @ApiParam({ name: 'id', example: '1', description: 'ID задачи' })
  @ApiResponse({ status: 200, description: 'Статус изменён', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён (чужая задача)' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async toggleComplete(@Request() req, @Param('id') id: string) {
    return this.tasksService.toggleComplete(req.user.userId, +id);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiParam({ name: 'id', example: '1', description: 'ID задачи' })
  @ApiResponse({ status: 200, description: 'Задача удалена', schema: { example: { message: 'Task deleted successfully' } } })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён (чужая задача)' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user.userId, +id);
  }
}