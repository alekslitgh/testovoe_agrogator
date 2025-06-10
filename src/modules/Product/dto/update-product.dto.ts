import { IsString, IsNumber, IsNotEmpty, Min, IsArray } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsNumber()
  @Min(0.01)
  price?: number;

  @IsArray()
  @IsString({ each: true })
  categoryNames?: string[];
}
