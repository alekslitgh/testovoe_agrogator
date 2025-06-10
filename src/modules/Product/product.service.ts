import { Product } from '@entities/product.entity';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/users.entity';
import { In, Repository } from 'typeorm';
import { ProductDto, PaginationDto, UpdateProductDto } from './dto';
import { ProductCategory } from '@entities/index';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
  ) {}

  async create(user: User, dto: ProductDto) {
    const existProduct = await this.productRepository.findOneBy({
      name: dto.name,
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

    return this.productRepository.save(product);
  }

  async findAll(pagination: PaginationDto, category: string, user: User) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .where('product.userId = :userId', { userId: user.id });

    if (category) {
      query.andWhere('category.name = :category', { category });
    }

    const [products, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: products,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(name: string, user: User) {
    const product = await this.productRepository.findOne({
      where: {
        user: { id: user.id },
        name,
      },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException(`Продукт ${name} не найден`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.productRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.categoryNames) {
      product.categories = await this.validateCategoriesByName(
        updateProductDto.categoryNames,
        user,
      );
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  private async validateCategoriesByName(
    categoryNames: string[],
    user: User,
  ): Promise<ProductCategory[]> {
    const categories = await this.categoryRepository.find({
      where: {
        name: In(categoryNames),
        user: { id: user.id },
      },
    });

    if (categories.length !== categoryNames.length) {
      throw new ForbiddenException(
        'Заданы неверные или несуществующие категории',
      );
    }

    return categories;
  }
}
