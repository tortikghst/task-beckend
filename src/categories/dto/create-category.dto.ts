
import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsOptional } from 'class-validator';



export class CreateCategoryDto {

  @ApiProperty({ example: 'Звуковое оборудование' })

  @IsString()

  name: string;



  @ApiProperty({ required: false, example: 'Микрофоны, акустика, микшеры' })

  @IsOptional()

  @IsString()

  description?: string;

}

