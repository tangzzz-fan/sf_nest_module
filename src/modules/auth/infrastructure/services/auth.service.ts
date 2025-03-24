import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IAuthService } from '../../domain/interfaces/auth-service.interface';
import { TokenPayload } from '../../domain/value-objects/token-payload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements IAuthService {
    // 使用内存存储替代 Redis
    private invalidatedTokens: Map<string, number> = new Map();

    // 定期清理过期的令牌（每小时运行一次）
    private cleanupInterval: NodeJS.Timeout;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        // 设置定期清理任务
        this.cleanupInterval = setInterval(() => this.cleanupExpiredTokens(), 3600000);
    }

    onModuleDestroy() {
        // 清理定时器
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }

    private cleanupExpiredTokens() {
        const now = Date.now();
        for (const [token, expiry] of this.invalidatedTokens.entries()) {
            if (expiry <= now) {
                this.invalidatedTokens.delete(token);
            }
        }
    }

    generateAccessToken(payload: TokenPayload): string {
        const secret = this.configService.get<string>('JWT_ACCESS_SECRET') ||
            this.configService.get<string>('jwt.secret') ||
            'fallback_secret_key';
        const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRATION') ||
            this.configService.get<string>('jwt.expiresIn') || '15m';

        return this.jwtService.sign(
            { ...payload },
            {
                secret,
                expiresIn,
            },
        );
    }

    generateRefreshToken(payload: TokenPayload): string {
        const secret = this.configService.get<string>('JWT_REFRESH_SECRET') ||
            this.configService.get<string>('jwt.secret') ||
            'fallback_refresh_secret_key';
        const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';

        return this.jwtService.sign(
            { ...payload },
            {
                secret,
                expiresIn,
            },
        );
    }

    async verifyToken(token: string): Promise<TokenPayload> {
        // 检查令牌是否在黑名单中
        if (this.invalidatedTokens.has(token)) {
            throw new Error('令牌已失效');
        }

        try {
            const secret = this.configService.get<string>('JWT_REFRESH_SECRET') ||
                this.configService.get<string>('jwt.secret') ||
                'fallback_verify_secret_key';

            const decoded = this.jwtService.verify(token, { secret });
            return new TokenPayload(decoded.userId, decoded.username, decoded.email);
        } catch (error) {
            throw new Error('无效的令牌');
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async invalidateToken(token: string): Promise<void> {
        try {
            // 解析令牌以获取过期时间
            const decoded = this.jwtService.decode(token) as any;
            if (decoded && decoded.exp) {
                const expiration = decoded.exp * 1000; // 转为毫秒
                // 保存令牌和其过期时间
                this.invalidatedTokens.set(token, expiration);
            }
        } catch (error) {
            console.error('Failed to invalidate token:', error);
        }
    }
} 