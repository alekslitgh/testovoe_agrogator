import { ProductDto } from '@modules/Product/dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/shared';

export class PaginatedProductResponse extends PaginatedResponseDto<ProductDto> {
  @ApiProperty({
    type: [ProductDto],
    description: 'Массив продуктов',
  })
  data: ProductDto[];
}
