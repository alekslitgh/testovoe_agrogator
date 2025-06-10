import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { User } from './users.entity';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity()
export class ProductCategory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
