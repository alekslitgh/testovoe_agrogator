import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/users.entity';
import { Repository } from 'typeorm';
import { ProductCategory } from '@entities/index';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationDto } from 'src/shared';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async create(user: User, dto: CreateCategoryDto): Promise<ProductCategory> {
    const existCategory = await this.categoryRepository.findOne({
      where: { name: dto.name, user: { id: user.id } },
    });

    if (existCategory) {
      throw new HttpException(
        `Категория с названием ${dto.name} уже существует!`,
        HttpStatus.CONFLICT,
      );
    }

    const category = this.categoryRepository.create({
      ...dto,
      user,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(
    pagination: PaginationDto,
    user: User,
  ): Promise<{ categories: ProductCategory[]; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { user: { id: user.id } },
      skip,
      take: limit,
    });

    return { categories, total };
  }

  async findAllWithoutPagination(user: User): Promise<ProductCategory[]> {
    return this.categoryRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: string, user: User): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
    user: User,
  ): Promise<ProductCategory> {
    const category = await this.findOne(id, user);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string, user: User): Promise<ProductCategory> {
    const category = await this.findOne(id, user);
    return this.categoryRepository.remove(category);
  }
}
