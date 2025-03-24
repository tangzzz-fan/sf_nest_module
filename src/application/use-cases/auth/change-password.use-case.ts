import { Injectable, Inject } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { IAuthService } from '../../../domain/services/auth-service.interface';
import { INJECTION_TOKENS } from '../../../domain/constants/injection-tokens';

export class ChangePasswordDto {
    @ApiProperty({ description: '用户ID', example: '550e8400-e29b-41d4-a716-446655440000', readOnly: true })
    userId: string;

    @ApiProperty({ description: '当前密码', example: 'current_password' })
    currentPassword: string;

    @ApiProperty({ description: '新密码', example: 'new_password' })
    newPassword: string;
}

@Injectable()
export class ChangePasswordUseCase {
    constructor(
        @Inject(INJECTION_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(INJECTION_TOKENS.AUTH_SERVICE)
        private readonly authService: IAuthService,
    ) { }

    async execute(dto: ChangePasswordDto): Promise<void> {
        // 查找用户
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new Error('用户不存在');
        }

        // 验证当前密码
        const passwordMatch = await this.authService.comparePassword(
            dto.currentPassword,
            user.password,
        );

        if (!passwordMatch) {
            throw new Error('当前密码错误');
        }

        // 哈希新密码
        const hashedPassword = await this.authService.hashPassword(dto.newPassword);

        // 更新密码
        user.updatePassword(hashedPassword);

        // 保存更新后的用户
        await this.userRepository.update(user);
    }
} 