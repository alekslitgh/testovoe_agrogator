import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthGuard } from '@modules/Auth/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductCategory } from '@entities/index';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([Product, ProductCategory]),
  ],
  controllers: [ProductController],
  providers: [ProductService, AuthGuard],
})
export class ProductModule {}
