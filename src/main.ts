import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './utils/validation';
import passport from 'passport';
import session from 'express-session';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  app.setGlobalPrefix('v1');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.enableCors({ origin: [config.get<string>('debugClientUrl')] });
  app.set('trust proxy', 1);
    // app.use(
    //   session({
    //     secret: config.get<string>('passportSessionSecret'),
    //     resave: false,
    //     saveUninitialized: false,
    //     cookie: {
    //       secure: false,
    //       maxAge: 1000 * 60 * 60, // 1 hour
    //     },
    //   }),
    // );


  app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(port || 3000);
}
bootstrap();
