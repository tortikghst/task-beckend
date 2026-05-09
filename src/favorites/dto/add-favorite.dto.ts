
import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';



export class AddFavoriteDto {

  @ApiProperty({ example: 'clgxxxxxx0000xxxxx' })

  @IsString()

  equipmentId: string;

}

