import { TokenPayload } from '../value-objects/token-payload';

export interface IAuthService {
    generateAccessToken(payload: TokenPayload): string;
    generateRefreshToken(payload: TokenPayload): string;
    verifyToken(token: string): Promise<TokenPayload>;
    hashPassword(password: string): Promise<string>;
    comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    invalidateToken(token: string): Promise<void>;
}