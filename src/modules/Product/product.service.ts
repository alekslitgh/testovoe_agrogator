import { Product } from '@entities/product.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/users.entity';
import { Repository } from 'typeorm';
import {
  ProductDto,
  UpdateProductDto,
  PaginatedProductResponse,
  ProductQueryDto,
} from './dto';
import { ProductCategory } from '@entities/index';
import { CategoryService } from '@modules/Categories/categories.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private categoryService: CategoryService,
  ) {}

  async create(user: User, dto: ProductDto): Promise<Product> {
    const existProduct = await this.productRepository.findOneBy({
      name: dto.name,
      user: { id: user.id },
    });

    if (existProduct) {
      throw new HttpException(
        `Продукт с названием ${dto.name} уже существует!`,
        HttpStatus.CONFLICT,
      );
    }

    const product = this.productRepository.create({
      ...dto,
      user,
    });

    if (dto.categoryNames?.length) {
      product.categories = await this.handleCategories(dto.categoryNames, user);
    }

    return this.productRepository.save(product);
  }

  async findAll(
    query: ProductQueryDto,
    user: User,
  ): Promise<PaginatedProductResponse> {
    const { page = 1, limit = 10, categories } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .where('product.userId = :userId', { userId: user.id });

    if (categories && categories.length > 0) {
      queryBuilder.andWhere('category.name IN (:...categories)', {
        categories,
      });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: plainToInstance(ProductDto, items),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user: User): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id,
        user: { id: user.id },
      },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException(`Продукт ${id} не найден`);
    }

    return product;
  }

  async update(
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: updateProductDto.id, user: { id: user.id } },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.categoryNames) {
      product.categories = await this.handleCategories(
        updateProductDto.categoryNames,
        user,
      );
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string, user: User): Promise<Product> {
    const product = await this.findOne(id, user);
    return this.productRepository.remove(product);
  }

  private async handleCategories(
    // проверяем категории товара, если нет - создаем новые
    categoryNames: string[],
    user: User,
  ): Promise<ProductCategory[]> {
    const existingCategories = await this.categoryService.findAll(
      { page: 1, limit: 1000 },
      user,
    );

    const existingCategoryNames = existingCategories.categories.map(
      (c) => c.name,
    );
    const categoriesToCreate = categoryNames.filter(
      (name) => !existingCategoryNames.includes(name),
    );

    await Promise.all(
      categoriesToCreate.map((name) =>
        this.categoryService.create(user, { name }),
      ),
    );

    const allCategories = await this.categoryService.findAll(
      { page: 1, limit: 1000 },
      user,
    );

    return allCategories.categories.filter((c) =>
      categoryNames.includes(c.name),
    );
  }
}
