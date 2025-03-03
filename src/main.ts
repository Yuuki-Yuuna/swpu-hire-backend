import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.setGlobalPrefix('api')
  // app.enableCors()
  await app.listen(process.env.PORT ?? 9000)
}

bootstrap()
