import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Купить молоко',
    description: 'Название задачи',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Купить 2 литра молока в магазине у дома',
    description: 'Описание задачи',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}