import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname, '..', 'public'), {
      prefix: '/',
    });

    app.setGlobalPrefix('api/v1');

    app.enableCors({
      origin: [
        'https://ganpatidiesel.netlify.app',
        'http://localhost:5173',
        'http://localhost:5174',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    app.use(helmet());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    const config = new DocumentBuilder()
      .setTitle('New Shree Ganpati Diesel Service API')
      .setDescription('The core API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

// Vercel serverless function entrypoint
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  return app(req, res);
}

// Local development / Render entrypoint
if (!process.env.VERCEL) {
  bootstrap().then((app) => {
    const port = process.env.PORT || 5000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Application is running on port ${port}`);
    });
  });
}
