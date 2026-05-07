import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(201)
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, createTaskDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.userId, +id);
  }

  // PUT для обновления title и description (как в ТЗ)
  @Put(':id')
  updateTaskFields(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string }
  ) {
    return this.tasksService.updateTaskFields(req.user.userId, +id, body);
  }

  // PATCH для частичного обновления (любых полей) – традиционный REST
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.update(req.user.userId, +id, updateTaskDto);
  }

  // PATCH для переключения статуса completed
  @Patch(':id/complete')
  toggleComplete(@Request() req, @Param('id') id: string) {
    return this.tasksService.toggleComplete(req.user.userId, +id);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Request() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user.userId, +id);
  }
}