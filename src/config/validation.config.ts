import { ValidationPipeOptions } from '@nestjs/common';

export const validationConfig = (): ValidationPipeOptions => ({
  whitelist: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});
