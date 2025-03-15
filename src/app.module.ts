import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import globalConfiguration from '../config/global.config';
import dbConfig from '../database/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicModule } from './modules/public/public.module';
import { ExternalServicesModule } from './modules/external-services/externalServices.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [globalConfiguration, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('dbConfig'),
    }),
    JwtModule.register({ global: true }),
    PublicModule,
    ExternalServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
