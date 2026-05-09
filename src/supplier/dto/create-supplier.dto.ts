
import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsOptional, IsNumber } from 'class-validator';



export class CreateSupplierDto {

  @ApiProperty({ example: 'ООО "ЗвукПро"' })

  companyName: string;



  @ApiProperty({ required: false, example: 'Профессиональный прокат звукового оборудования' })

  @IsOptional()

  description?: string;



  @ApiProperty({ required: false, example: '+74951234567' })

  @IsOptional()

  phone?: string;



  @ApiProperty({ required: false, example: 'info@zvukpro.ru' })

  @IsOptional()

  email?: string;



  @ApiProperty({ required: false, example: 'https://example.com/logo.png' })

  @IsOptional()

  logo?: string;

}

