import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './httpException.fliter';

declare const module: NodeJS.Module & {
  hot?: {
    accept: () => void;
    dispose: (callback: () => void) => void;
  };
};
dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
});


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Cookie'],
  });
 app.use(
    '/video/webhook/mux',
    bodyParser.raw({ type: 'application/json' }),
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // 스웨거 설정
  const config = new DocumentBuilder()
    .setTitle('jammit api문서')
    .setDescription('jammit 개발을 위한 api문서')
    .setVersion('1.0')
    // 스웨거에서 로그인 할때
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'JWT access token',
        in: 'header',
      },
      'access-token', 
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // 예외처리
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT;
  await app.listen(port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      void app.close();
    });
  }
}
bootstrap().catch((error) => {
  console.error('Failed to start the server:', error);
});
