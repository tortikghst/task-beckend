
import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNumber, IsDateString, IsArray, ValidateNested, IsOptional } from 'class-validator';

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

  @ApiProperty({ required: false })

  @IsOptional()

  eventType?: string;



  @ApiProperty({ required: false })

  @IsOptional()

  @IsDateString()

  eventDate?: string;



  @ApiProperty({ required: false })

  @IsOptional()

  eventCity?: string;



  @ApiProperty({ type: [OrderItemDto] })

  @IsArray()

  @ValidateNested({ each: true })

  @Type(() => OrderItemDto)

  items: OrderItemDto[];

}

