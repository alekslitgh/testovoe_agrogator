import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';
import { ProductCategory } from './product-category.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  // select = false не достаёт пароль из юзера, если это прямо не указано
  @Column({ select: false })
  password: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => ProductCategory, (category) => category.user)
  categories: ProductCategory[];
}
