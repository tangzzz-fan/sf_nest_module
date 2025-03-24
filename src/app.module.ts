import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import configuration from './config/configuration';
import { User } from './domain/entities/user.entity';
import { Message } from './domain/entities/message.entity';

import { UserRepository } from './infrastructure/repositories/user.repository';
import { MessageRepository } from './infrastructure/repositories/message.repository';
import { INJECTION_TOKENS } from './domain/constants/injection-tokens';

import { MessageController } from './presentation/controllers/message.controller';
import { ChatGateway } from './presentation/gateways/chat.gateway';

import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { AuthModule } from './auth.module';

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
        AuthModule,
    ],
    controllers: [MessageController],
    providers: [
        JwtStrategy,
        {
            provide: INJECTION_TOKENS.USER_REPOSITORY,
            useClass: UserRepository,
        },
        {
            provide: INJECTION_TOKENS.MESSAGE_REPOSITORY,
            useClass: MessageRepository,
        },
        ChatGateway,
    ],
})
export class AppModule { } 