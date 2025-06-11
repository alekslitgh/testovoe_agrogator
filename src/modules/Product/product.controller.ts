import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { GetUser } from '@modules/Auth/decorators/get-user.decorator';
import { User } from '@entities/users.entity';
import { AuthGuard } from '@modules/Auth/auth.guard';
import { plainToInstance } from 'class-transformer';
import {
  PaginatedProductResponse,
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './dto';
import { PaginationDto } from 'src/shared';

@ApiTags('Product management options')
@ApiBearerAuth('X-AUTH-TOKEN')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({ type: ProductDto })
  @ApiOperation({ summary: 'Creates product for user.' })
  @ApiResponse({
    status: 201,
    type: ProductDto,
    description: 'Product successfully created.',
  })
  @ApiResponse({
    status: 409,
    description: 'Product with this name already exists.',
  })
  async create(@Body() createProductDto: ProductDto, @GetUser() user: User) {
    const product = await this.productService.create(user, createProductDto);
    return plainToInstance(ProductDto, product);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Finds product by id.' })
  @ApiResponse({
    status: 200,
    type: ProductDto,
    description: 'Product found succsessfully.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('name') id: string, @GetUser() user: User) {
    const product = this.productService.findOne(id, user);
    return plainToInstance(ProductDto, product);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Finds all products by category with pagination.' })
  @ApiExtraModels(ProductQueryDto)
  @ApiResponse({
    status: 200,
    type: PaginatedProductResponse,
    description: 'List of products.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: ProductQueryDto, @GetUser() user: User) {
    return this.productService.findAll(query, user);
  }

  @UseGuards(AuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Updates product.' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    type: ProductDto,
    description: 'Product succsessfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    const product = await this.productService.update(updateProductDto, user);
    return plainToInstance(ProductDto, product);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return this.productService.remove(id, user);
  }
}
