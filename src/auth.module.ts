import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/auth/login-user.use-case';
import { RefreshTokenUseCase } from './application/use-cases/auth/refresh-token.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/auth/update-user-profile.use-case';
import { ChangePasswordUseCase } from './application/use-cases/auth/change-password.use-case';
import { LogoutUserUseCase } from './application/use-cases/auth/logout-user.use-case';
import { AuthService } from './infrastructure/services/auth.service';
import { INJECTION_TOKENS } from './domain/constants/injection-tokens';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { User } from './domain/entities/user.entity';
import { UserRepository } from './infrastructure/repositories/user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_SECRET') || configService.get<string>('jwt.secret'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION') || configService.get<string>('jwt.expiresIn') || '15m',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        RegisterUserUseCase,
        LoginUserUseCase,
        RefreshTokenUseCase,
        UpdateUserProfileUseCase,
        ChangePasswordUseCase,
        LogoutUserUseCase,
        JwtAuthGuard,
        {
            provide: INJECTION_TOKENS.AUTH_SERVICE,
            useClass: AuthService,
        },
        {
            provide: INJECTION_TOKENS.USER_REPOSITORY,
            useClass: UserRepository,
        }
    ],
    exports: [
        JwtAuthGuard,
        RegisterUserUseCase,
        LoginUserUseCase,
        RefreshTokenUseCase,
        UpdateUserProfileUseCase,
        ChangePasswordUseCase,
        LogoutUserUseCase,
        {
            provide: INJECTION_TOKENS.AUTH_SERVICE,
            useClass: AuthService,
        }
    ],
})
export class AuthModule { } 