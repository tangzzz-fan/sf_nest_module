import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import * as bcrypt from 'bcryptjs';
import { USER_REPOSITORY_TOKEN } from '../../../domain/constants/injection-tokens';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async execute(username: string, password: string): Promise<{ access_token: string }> {
        const user = await this.userRepository.findByUsername(username);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
} 