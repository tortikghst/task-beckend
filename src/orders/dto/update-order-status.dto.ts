
import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';



export class UpdateOrderStatusDto {

  @ApiProperty({ enum: ['CREATED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })

  @IsString()

  status: string;

}

