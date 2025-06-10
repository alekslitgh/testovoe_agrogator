import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { swaggerConfig, validationConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(validationConfig()));
  const configService = app.get(ConfigService);
  const isProduction = configService.get('IS_PRODUCTION');

  if (isProduction === 'false') {
    const document = () => SwaggerModule.createDocument(app, swaggerConfig());
    SwaggerModule.setup('api', app, document);
  }
  const port = configService.get('PORT');

  app.use('/public', express.static('public'));

  await app.listen(port || 3000);
}
bootstrap();
