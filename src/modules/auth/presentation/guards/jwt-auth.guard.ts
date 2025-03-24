import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('未提供授权令牌');
        }

        try {
            // 确保获取字符串类型的secret
            const secret = this.configService.get<string>('JWT_ACCESS_SECRET') ||
                this.configService.get<string>('jwt.secret') ||
                'fallback_guard_secret_key'; // 添加备用密钥确保不会undefined

            const payload = this.jwtService.verify(token, { secret });

            // 将用户信息附加到请求对象
            request.user = payload;

            // 检查令牌是否即将过期（如果10分钟内过期，则刷新）
            this.checkTokenExpiration(payload, response);

            return true;
        } catch (error) {
            throw new UnauthorizedException('授权令牌无效或已过期');
        }
    }

    private checkTokenExpiration(payload: any, response: Response): void {
        // 获取过期时间（JWT 的 exp 是以秒为单位的时间戳）
        const expiration = payload.exp * 1000; // 转换为毫秒
        const now = Date.now();
        const timeToExpire = expiration - now;

        // 如果令牌将在10分钟内过期，在响应头中附加新令牌
        if (timeToExpire > 0 && timeToExpire < 10 * 60 * 1000) {
            const newPayload = {
                userId: payload.userId,
                username: payload.username,
                email: payload.email
            };

            // 生成新的访问令牌
            const secret = this.configService.get<string>('JWT_ACCESS_SECRET') ||
                this.configService.get<string>('jwt.secret') ||
                'fallback_refresh_secret_key'; // 添加备用密钥

            const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRATION') ||
                this.configService.get<string>('jwt.expiresIn') || '15m';

            const newToken = this.jwtService.sign(newPayload, {
                secret,
                expiresIn,
            });

            // 在响应头中设置新的令牌
            response.setHeader('X-New-Access-Token', newToken);
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
} 