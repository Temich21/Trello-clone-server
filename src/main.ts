import { config } from "dotenv";
config()

import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  })

  app.use(cookieParser())
  const PORT = process.env.PORT || 3000
  console.log(`Server is running on port ${PORT}`)
  await app.listen(process.env.PORT!)
}
bootstrap()
