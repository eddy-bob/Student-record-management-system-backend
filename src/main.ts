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
import helmet from 'helmet'; 
import { Request,Response, NextFunction } from 'express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  app.setGlobalPrefix('v1');
   // Use Helmet to set various security headers
  app.use(helmet());

  // Disable X-Powered-By header
  app.disable('x-powered-by');

  // Custom headers
  app.use((req:Request, res:Response, next:NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    exceptionFactory: validationExceptionFactory,
    }),
  );
  app.enableCors({ origin: [config.get<string>('cors.debugClient')] });
  const sessionSecret = config.get<string>('passportSessionSecret');

  app.set('trust proxy', 1);
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true,
      proxy: true,
      cookie: { secure: true, sameSite: 'none' },
    }),
  );


  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port || 3000);
}
bootstrap();
