import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') ||
                configService.get<string>('jwt.secret') ||
                'fallback_jwt_strategy_secret',
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.userId,
            username: payload.username,
            email: payload.email,
        };
    }
} 