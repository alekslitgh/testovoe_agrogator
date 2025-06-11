import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '@modules/Auth/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductCategory } from '@entities/index';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Product, ProductCategory]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, AuthGuard],
  exports: [CategoryService],
})
export class CategoryModule {}
