import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from '../../application/usecases/auth/login.usecase';
import { RegisterUseCase } from '../../application/usecases/auth/register.usecase';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase
    ) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.loginUseCase.execute(loginDto.username, loginDto.password);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.registerUseCase.execute(
            registerDto.username,
            registerDto.password,
            registerDto.displayName
        );
    }
} 