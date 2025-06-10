import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@modules/Auth/auth.module';
import { User } from '@entities/users.entity';
import { Product } from '@entities/product.entity';
import { ProductCategory } from '@entities/product-category.entity';
import { ProductModule } from '@modules/Product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // указывает на файл .env в корне проекта
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Product, ProductCategory],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductModule,
  ],
})
export class AppModule {}
