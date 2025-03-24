import { Injectable, Inject } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IAuthService } from '../../../domain/services/auth-service.interface';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { INJECTION_TOKENS } from '../../../domain/constants/injection-tokens';
import { TokenPayload } from '../../../domain/value-objects/token-payload';

export class RefreshTokenDto {
    @ApiProperty({ description: '刷新令牌', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    refreshToken: string;
}

export class RefreshTokenResult {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        @Inject(INJECTION_TOKENS.AUTH_SERVICE)
        private readonly authService: IAuthService,
        @Inject(INJECTION_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(dto: RefreshTokenDto): Promise<RefreshTokenResult> {
        try {
            // 验证刷新令牌，添加 await 关键字
            const payload = await this.authService.verifyToken(dto.refreshToken);

            // 检查用户是否存在
            const user = await this.userRepository.findById(payload.userId);
            if (!user || !user.isActive) {
                throw new Error('无效的用户或用户已禁用');
            }

            // 生成新令牌
            const newPayload = new TokenPayload(user.id, user.username, user.email);
            const accessToken = this.authService.generateAccessToken(newPayload);
            const refreshToken = this.authService.generateRefreshToken(newPayload);

            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw new Error('无效的刷新令牌');
        }
    }
} 