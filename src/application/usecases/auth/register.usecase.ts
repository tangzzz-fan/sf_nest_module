import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import * as bcrypt from 'bcryptjs';
import { USER_REPOSITORY_TOKEN } from '../../../domain/constants/injection-tokens';

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(username: string, password: string, displayName?: string): Promise<{ id: string; username: string }> {
        // 检查用户名是否已存在
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        // 密码加密
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // 创建新用户
        const user = await this.userRepository.create({
            username,
            password: hashedPassword,
            displayName: displayName || username,
        });

        // 返回不包含密码的用户信息
        return {
            id: user.id,
            username: user.username,
        };
    }
} 