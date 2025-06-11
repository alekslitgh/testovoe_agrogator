import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, Min, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  price: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];
}
