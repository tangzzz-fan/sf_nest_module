import { Injectable, Inject } from '@nestjs/common';
import { IAuthService } from '../../domain/interfaces/auth-service.interface';
import { INJECTION_TOKENS } from '../../../../domain/constants/injection-tokens';

export class LogoutUserDto {
    userId: string;
    refreshToken: string;
}

@Injectable()
export class LogoutUserUseCase {
    constructor(
        @Inject(INJECTION_TOKENS.AUTH_SERVICE)
        private readonly authService: IAuthService,
    ) { }

    async execute(dto: LogoutUserDto): Promise<void> {
        // 将刷新令牌加入黑名单
        await this.authService.invalidateToken(dto.refreshToken);
    }
} 