import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();

let appInitialized = false;

async function bootstrap() {
  if (appInitialized) return;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  appInitialized = true;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}
