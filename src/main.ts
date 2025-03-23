import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './infrastructure/config/swagger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const configService = app.get(ConfigService);
    const port = configService.get<number>('port');

    // 设置 Swagger
    setupSwagger(app);

    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap(); 