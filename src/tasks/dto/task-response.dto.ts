import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 1, description: 'ID задачи' })
  id: number;

  @ApiProperty({ example: 'Купить молоко', description: 'Название задачи' })
  title: string;

  @ApiProperty({ example: 'Купить 2 литра молока', description: 'Описание задачи' })
  description: string | null;

  @ApiProperty({ example: false, description: 'Статус выполнения' })
  isCompleted: boolean;

  @ApiProperty({ example: '2024-01-01T12:00:00Z', description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00Z', description: 'Дата обновления' })
  updatedAt: Date;

  @ApiProperty({ example: 1, description: 'ID пользователя' })
  userId: number;
}