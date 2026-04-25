import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Security
    app.use(helmet());
    app.enableCors({
        origin: process.env.WEB_URL ?? 'http://localhost:3000',
        credentials: true,
    });

    // Global exception filter + request logger
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    // URI versioning: /api/v1/...
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    // Swagger / OpenAPI (dev only)
    if (process.env.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('Smart Bookmark API')
            .setDescription('REST API for Smart Bookmark application')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);
    }

    const port = process.env.PORT ?? 4000;
    await app.listen(port);
    console.log(`API running on http://localhost:${port}/api/v1`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Swagger docs at http://localhost:${port}/api/docs`);
    }
}
bootstrap();

