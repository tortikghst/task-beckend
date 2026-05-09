
import { ApiProperty } from '@nestjs/swagger';

import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';



export class CreateReviewDto {

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })

  @IsInt()

  @Min(1)

  @Max(5)

  rating: number;



  @ApiProperty({ example: 'Отличный поставщик, быстро доставили оборудование!', required: false })

  @IsOptional()

  @IsString()

  comment?: string;

}

