import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { GetUser } from '@modules/Auth/decorators/get-user.decorator';
import { User } from '@entities/users.entity';
import { AuthGuard } from '@modules/Auth/auth.guard';
import { plainToInstance } from 'class-transformer';
import { PaginationDto, ProductDto } from './dto';

@ApiTags('Product management options')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({ type: ProductDto })
  @ApiOperation({ summary: 'Создает продукт для пользователя' })
  @ApiResponse({
    status: 201,
    type: [ProductDto],
    description: 'Продукт успешно создан.',
  })
  async create(@Body() createProductDto: any, @GetUser() user: User) {
    const product = await this.productService.create(user, createProductDto);
    return plainToInstance(ProductDto, product);
  }

  @UseGuards(AuthGuard)
  @Get(':name')
  @ApiOperation({ summary: 'Находит продукт по названию' })
  @ApiResponse({
    status: 200,
    type: ProductDto,
    description: 'Продукт найден.',
  })
  @ApiResponse({ status: 404, description: 'Продукт не найден.' })
  async findOne(@Param('name') name: string, @GetUser() user: User) {
    const product = this.productService.findOne(name, user);
    return plainToInstance(ProductDto, product);
  }

  @UseGuards(AuthGuard)
  @Get(':category')
  @ApiOperation({ summary: 'Находит все продукты по категории' })
  @ApiResponse({
    status: 200,
    type: ProductDto,
    isArray: true,
    description: 'Продукты найдены.',
  })
  @ApiResponse({ status: 404, description: 'Продукты не найдены.' })
  async findAll(
    @Param('category') category: string,
    @Query() pagination: PaginationDto,
    @GetUser() user: User,
  ) {
    const { data, meta } = await this.productService.findAll(
      pagination,
      category,
      user,
    );
    return { data: plainToInstance(ProductDto, data), meta };
  }
}
