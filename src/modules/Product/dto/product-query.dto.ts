import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @ApiProperty({
    required: false,
    description: 'Фильтр по названиям категорий',
    example: ['category1', 'category2'],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  categories?: string[];

  @ApiProperty({
    required: false,
    default: 1,
    example: 1,
    description: 'Номер страницы',
  })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    example: 10,
    description: 'Количество элементов на странице',
  })
  @IsOptional()
  limit?: number = 10;
}
