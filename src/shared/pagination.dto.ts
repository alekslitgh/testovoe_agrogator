import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Общее количество элементов',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Количество элементов на странице',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Общее количество страниц',
    example: 10,
  })
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ type: [Object] })
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class PaginationDto {
  @ApiProperty({
    required: false,
    default: 1,
    example: 1,
    description: 'Номер страницы',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    example: 10,
    description: 'Количество элементов на странице',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
