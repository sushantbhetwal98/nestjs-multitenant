import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import globalConfiguration from 'config/global.config';
import { Logger } from '@nestjs/common';
import { CustomValidationPipe } from 'common/pipe/custom-validation.pipe';
import { ResponseInterceptor } from 'common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // handling response
  const loggerInstance = app.get(Logger);
  app.useGlobalInterceptors(new ResponseInterceptor(loggerInstance));

  // custom validation pipe for validation input and filtering extra data from input
  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  // for enablin cors from all origin in dev
  app.enableCors({
    origin: '*',
  });

  await app.listen(globalConfiguration().PORT);
}
bootstrap();
