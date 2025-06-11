import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthGuard } from '@modules/Auth/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductCategory } from '@entities/index';
import { CategoryModule } from '@modules/Categories/categories.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Product, ProductCategory]),
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, AuthGuard],
  exports: [ProductService],
})
export class ProductModule {}
