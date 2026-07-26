import { NestFactory } from '@nestjs/core';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(cookieParser());

  app.enableCors({

    origin: (origin, callback) => {

      if (!origin) {
        return callback(null, true);
      }

      if (
        origin === 'https://mpumudde-high-school.vercel.app' ||
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

  });

  app.useGlobalPipes(

    new ValidationPipe({

      whitelist: true,

      transform: true,

    }),

  );

  await app.listen(

    process.env.PORT ?? 3000,

  );

}

bootstrap();