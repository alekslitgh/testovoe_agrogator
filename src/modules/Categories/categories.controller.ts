import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetUser } from '@modules/Auth/decorators/get-user.decorator';
import { User } from '@entities/users.entity';
import { AuthGuard } from '@modules/Auth/auth.guard';
import { plainToInstance } from 'class-transformer';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryDto,
  PaginatedCategoryResponse,
} from './dto';
import { CategoryService } from './categories.service';
import { PaginationDto } from 'src/shared';

@ApiTags('Category management options')
@ApiBearerAuth('X-AUTH-TOKEN')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    type: CategoryDto,
    description: 'Category successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  async create(@Body() dto: CreateCategoryDto, @GetUser() user: User) {
    const category = await this.categoryService.create(user, dto);
    return plainToInstance(CategoryDto, category);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Finds all categories with pagination.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    type: PaginatedCategoryResponse,
    description: 'Categories list',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: PaginationDto, @GetUser() user: User) {
    const { categories, total } = await this.categoryService.findAll(
      query,
      user,
    );
    const categoryDtos = categories.map((category) =>
      plainToInstance(CategoryDto, category),
    );

    return {
      data: categoryDtos,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: CategoryDto,
    description: 'Category details',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    const category = await this.categoryService.findOne(id, user);
    return plainToInstance(CategoryDto, category);
  }

  @UseGuards(AuthGuard)
  @Patch('id')
  @ApiOperation({ summary: 'Updates category' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    type: CategoryDto,
    description: 'Updated category',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param() id: string,
    @Body() dto: UpdateCategoryDto,
    @GetUser() user: User,
  ) {
    const category = await this.categoryService.update(id, dto, user);
    return plainToInstance(CategoryDto, category);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return this.categoryService.remove(id, user);
  }
}
