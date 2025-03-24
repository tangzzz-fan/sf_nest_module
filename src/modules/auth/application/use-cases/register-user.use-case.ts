import { Injectable, Inject } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IUserRepository } from '../../../../domain/repositories/user-repository.interface';
import { IAuthService } from '../../domain/interfaces/auth-service.interface';
import { User } from '../../../../domain/entities/user.entity';
import { INJECTION_TOKENS } from '../../../../domain/constants/injection-tokens';

export class RegisterUserDto {
    @ApiProperty({ description: '电子邮箱', example: 'user@example.com' })
    email: string;

    @ApiProperty({ description: '用户名', example: 'username' })
    username: string;

    @ApiProperty({ description: '密码', example: 'password123' })
    password: string;
}

export class RegisterUserResult {
    id: string;
    email: string;
    username: string;
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class RegisterUserUseCase {
    constructor(
        @Inject(INJECTION_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(INJECTION_TOKENS.AUTH_SERVICE)
        private readonly authService: IAuthService,
    ) { }

    async execute(dto: RegisterUserDto): Promise<RegisterUserResult> {
        // 检查邮箱是否已存在
        const existingUserByEmail = await this.userRepository.findByEmail(dto.email);
        if (existingUserByEmail) {
            throw new Error('邮箱已被注册');
        }

        // 检查用户名是否已存在
        const existingUserByUsername = await this.userRepository.findByUsername(dto.username);
        if (existingUserByUsername) {
            throw new Error('用户名已被使用');
        }

        // 哈希密码
        const hashedPassword = await this.authService.hashPassword(dto.password);

        // 创建用户
        const user = User.create(dto.email, dto.username, hashedPassword);

        // 保存用户
        const savedUser = await this.userRepository.create(user);

        // 生成令牌
        const payload = { userId: savedUser.id, username: savedUser.username, email: savedUser.email };
        const accessToken = this.authService.generateAccessToken(payload);
        const refreshToken = this.authService.generateRefreshToken(payload);

        return {
            id: savedUser.id,
            email: savedUser.email,
            username: savedUser.username,
            accessToken,
            refreshToken,
        };
    }
} 