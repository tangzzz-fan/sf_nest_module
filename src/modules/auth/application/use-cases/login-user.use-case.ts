import { Injectable, Inject } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IUserRepository } from '../../../../domain/repositories/user-repository.interface';
import { IAuthService } from '../../domain/interfaces/auth-service.interface';
import { INJECTION_TOKENS } from '../../../../domain/constants/injection-tokens';
import { TokenPayload } from '../../../auth/domain/value-objects/token-payload';

export class LoginUserDto {
    @ApiProperty({ description: '电子邮箱', example: 'user@example.com' })
    email: string;

    @ApiProperty({ description: '密码', example: 'password123' })
    password: string;
}

export class LoginUserResult {
    id: string;
    email: string;
    username: string;
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class LoginUserUseCase {
    constructor(
        @Inject(INJECTION_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(INJECTION_TOKENS.AUTH_SERVICE)
        private readonly authService: IAuthService,
    ) { }

    async execute(dto: LoginUserDto): Promise<LoginUserResult> {
        // 查找用户
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new Error('用户不存在');
        }

        // 验证密码
        const passwordMatch = await this.authService.comparePassword(
            dto.password,
            user.password,
        );

        if (!passwordMatch) {
            throw new Error('密码错误');
        }

        if (!user.isActive) {
            throw new Error('用户账号已禁用');
        }

        // 生成令牌
        const payload = new TokenPayload(user.id, user.username, user.email);
        const accessToken = this.authService.generateAccessToken(payload);
        const refreshToken = this.authService.generateRefreshToken(payload);

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            accessToken,
            refreshToken,
        };
    }
} 