import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import configuration from './config/configuration';
import { User } from './domain/entities/user.entity';
import { Message } from './domain/entities/message.entity';

import { UserRepository } from './infrastructure/repositories/user.repository';
import { MessageRepository } from './infrastructure/repositories/message.repository';
import { USER_REPOSITORY_TOKEN, MESSAGE_REPOSITORY_TOKEN } from './domain/constants/injection-tokens';

import { LoginUseCase } from './application/usecases/auth/login.usecase';
import { CreateMessageUseCase } from './application/usecases/message/create-message.usecase';
import { RegisterUseCase } from './application/usecases/auth/register.usecase';

import { AuthController } from './interface/controllers/auth.controller';
import { MessageController } from './interface/controllers/message.controller';
import { ChatGateway } from './interface/gateways/chat.gateway';

import { JwtStrategy } from './infrastructure/auth/jwt.strategy';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.database'),
                entities: [User, Message],
                synchronize: true,
            }),
        }),
        TypeOrmModule.forFeature([User, Message]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('jwt.secret'),
                signOptions: { expiresIn: configService.get('jwt.expiresIn') },
            }),
        }),
    ],
    controllers: [AuthController, MessageController],
    providers: [
        JwtStrategy,
        {
            provide: USER_REPOSITORY_TOKEN,
            useClass: UserRepository,
        },
        {
            provide: MESSAGE_REPOSITORY_TOKEN,
            useClass: MessageRepository,
        },
        LoginUseCase,
        CreateMessageUseCase,
        RegisterUseCase,
        ChatGateway,
    ],
})
export class AppModule { } 