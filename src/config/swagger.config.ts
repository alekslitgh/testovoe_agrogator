import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('example')
    .setDescription('API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description: 'Enter your token',
      },
      'X-AUTH-TOKEN',
    )
    .build();
};
