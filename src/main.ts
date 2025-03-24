import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { setupSwagger } from './infrastructure/config/swagger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const configService = app.get(ConfigService);
    const port = configService.get<number>('port') || 3000;

    // 验证关键配置
    const jwtSecret = configService.get<string>('jwt.secret');
    if (!jwtSecret) {
        console.error('缺少必要的JWT密钥配置，应用程序无法启动');
        process.exit(1);
    }

    setupSwagger(app);

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap(); 