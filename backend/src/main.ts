import { NestFactory } from '@nestjs/core';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  /*
   * We register the parsers below after CORS.  Keeping Nest's default parser
   * and registering Express parsers as well makes every JSON request pass
   * through two parser stacks.  More importantly, the local Express parser
   * dependency can then fail before CORS has a chance to add its headers.
   */
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const configuredOrigins = (process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const allowedOrigins = new Set([
    'https://mpumudde-high-school.vercel.app',
    ...configuredOrigins,
  ]);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.has(origin.replace(/\/$/, '')) || /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  const hasContentType = (request: unknown, value: string) => {
    const headers = (request as {
      headers?: Record<string, string | string[] | undefined>;
    }).headers;
    const contentType = headers?.['content-type'];

    return (
      typeof contentType === 'string' &&
      contentType.toLowerCase().includes(value)
    );
  };

  app.use(
    express.json({
      limit: '10mb',
      type: (request) => hasContentType(request, 'application/json'),
    }),
  );
  app.use(
    express.urlencoded({
      limit: '10mb',
      extended: true,
      type: (request) =>
        hasContentType(request, 'application/x-www-form-urlencoded'),
    }),
  );
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
