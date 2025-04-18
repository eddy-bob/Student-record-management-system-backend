import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Request, Response } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 🔐 Use Helmet for security headers
  app.use(helmet());

  app.use((req: Request, res: Response, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
    res.removeHeader('Server'); // remove server type info
    res.removeHeader('X-Powered-By'); // remove framework info
    next();
  });
  app.setGlobalPrefix('v1');
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
