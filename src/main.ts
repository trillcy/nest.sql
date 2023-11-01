import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exeption.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorsForResponse: any = [];
        errors.forEach((el: any) => {
          const constraintsKeys = Object.keys(el.constraints);

          constraintsKeys.forEach((ckey) => {
            const obj: any = {
              message: el.constraints[ckey],
              field: el.property,
            };
            errorsForResponse.push(obj);
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3033);
}
bootstrap();
