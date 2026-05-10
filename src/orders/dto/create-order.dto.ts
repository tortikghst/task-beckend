
import { ApiProperty } from '@nestjs/swagger';

import { IsArray, ValidateNested, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

import { Type } from 'class-transformer';



export class OrderItemDto {

  @ApiProperty()

  equipmentId: string;

  @ApiProperty()

  quantity: number;

  @ApiProperty()

  startDate: string;

  @ApiProperty()

  endDate: string;

}



export class CreateOrderDto {

  @ApiProperty({ type: [OrderItemDto] })

  @IsArray()

  @ValidateNested({ each: true })

  @Type(() => OrderItemDto)

  items: OrderItemDto[];



  @ApiProperty({ required: false })

  @IsOptional()

  @IsString()

  eventType?: string;



  @ApiProperty({ required: false })

  @IsOptional()

  @IsDateString()

  eventDate?: string;



  @ApiProperty({ required: false })

  @IsOptional()

  @IsString()

  eventCity?: string;

}

