import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'path';

if (
  !existsSync(join(process.cwd(), 'key.pem')) ||
  !existsSync(join(process.cwd(), 'cert.pem'))
) {
  throw new Error('SSL certificate files not found: key.pem or cert.pem');
}

const httpsOptions = {
  key: readFileSync(join(process.cwd(), 'key.pem')),
  cert: readFileSync(join(process.cwd(), 'cert.pem'))
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    httpsOptions
  });

  app.useStaticAssets(process.cwd() + process.env.ASSETS_PATH);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const config = new DocumentBuilder()
    .setTitle('ICPC API')
    .setDescription('The ICPC API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}

bootstrap().then(() => console.log('Server is running'));
