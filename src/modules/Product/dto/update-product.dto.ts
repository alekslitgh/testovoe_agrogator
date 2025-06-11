import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, IsArray } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  price?: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  categoryNames?: string[];
}
