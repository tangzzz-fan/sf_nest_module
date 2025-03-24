import { Injectable, Inject } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { INJECTION_TOKENS } from '../../../domain/constants/injection-tokens';

export class UpdateUserProfileDto {
    @ApiProperty({ description: '用户ID', example: '550e8400-e29b-41d4-a716-446655440000', readOnly: true })
    userId: string;

    @ApiPropertyOptional({ description: '用户名', example: 'new_username' })
    username?: string;

    @ApiPropertyOptional({ description: '电子邮箱', example: 'new_email@example.com' })
    email?: string;
}

export class UpdateUserProfileResult {
    id: string;
    email: string;
    username: string;
}

@Injectable()
export class UpdateUserProfileUseCase {
    constructor(
        @Inject(INJECTION_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(dto: UpdateUserProfileDto): Promise<UpdateUserProfileResult> {
        // 查找用户
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new Error('用户不存在');
        }

        // 更新用户信息
        if (dto.username) {
            // 检查用户名是否已存在
            const existingUser = await this.userRepository.findByUsername(dto.username);
            if (existingUser && existingUser.id !== dto.userId) {
                throw new Error('用户名已被使用');
            }
            user.updateUsername(dto.username);
        }

        if (dto.email) {
            // 检查邮箱是否已存在
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser && existingUser.id !== dto.userId) {
                throw new Error('邮箱已被注册');
            }
            user.updateEmail(dto.email);
        }

        // 保存更新后的用户
        const updatedUser = await this.userRepository.update(user);

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
        };
    }
} 