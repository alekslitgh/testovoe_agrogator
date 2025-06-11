import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/shared';
import { CategoryDto } from './category.dto';

export class PaginatedCategoryResponse extends PaginatedResponseDto<CategoryDto> {
  @ApiProperty({
    type: [CategoryDto],
    description: 'Массив продуктов',
  })
  data: CategoryDto[];
}
