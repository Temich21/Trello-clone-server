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
  const port = process.env.PORT || 3000
  console.log(`Server is running on port ${port}`)
  await app.listen(port)
}
bootstrap()
