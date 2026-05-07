import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    example: true,
    description: 'Статус выполнения задачи',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}