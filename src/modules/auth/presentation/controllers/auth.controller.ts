import { Controller, Post, Body, UseGuards, Get, Req, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RegisterUserUseCase, RegisterUserDto } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase, LoginUserDto } from '../../application/use-cases/login-user.use-case';
import { RefreshTokenUseCase, RefreshTokenDto } from '../../application/use-cases/refresh-token.use-case';
import { UpdateUserProfileUseCase, UpdateUserProfileDto } from '../../application/use-cases/update-user-profile.use-case';
import { ChangePasswordUseCase, ChangePasswordDto } from '../../application/use-cases/change-password.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.use-case';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
        private readonly changePasswordUseCase: ChangePasswordUseCase,
        private readonly logoutUserUseCase: LogoutUserUseCase,
    ) { }

    @Post('register')
    @ApiOperation({ summary: '用户注册' })
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({
        status: 200,
        description: '注册成功',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
                        email: { type: 'string', example: 'user@example.com' },
                        username: { type: 'string', example: 'username' },
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: '注册失败',
        schema: {
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: '邮箱已被注册' }
            }
        }
    })
    async register(@Body() dto: RegisterUserDto) {
        try {
            const result = await this.registerUserUseCase.execute(dto);
            return {
                success: true,
                data: {
                    id: result.id,
                    email: result.email,
                    username: result.username,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                },
            };
        } catch (error: unknown) {
            return {
                success: false,
                message: this.getErrorMessage(error),
            };
        }
    }

    @Post('login')
    @ApiOperation({ summary: '用户登录' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: 200,
        description: '登录成功',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
                        email: { type: 'string', example: 'user@example.com' },
                        username: { type: 'string', example: 'username' },
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: '登录失败',
        schema: {
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: '密码错误' }
            }
        }
    })
    async login(@Body() dto: LoginUserDto) {
        try {
            const result = await this.loginUserUseCase.execute(dto);
            return {
                success: true,
                data: {
                    id: result.id,
                    email: result.email,
                    username: result.username,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                },
            };
        } catch (error: unknown) {
            return {
                success: false,
                message: this.getErrorMessage(error),
            };
        }
    }

    @Post('refresh-token')
    @ApiOperation({ summary: '刷新访问令牌' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: '刷新成功',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: '刷新失败',
        schema: {
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: '无效的刷新令牌' }
            }
        }
    })
    async refreshToken(@Body() dto: RefreshTokenDto) {
        try {
            const result = await this.refreshTokenUseCase.execute(dto);
            return {
                success: true,
                data: {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                },
            };
        } catch (error: unknown) {
            return {
                success: false,
                message: this.getErrorMessage(error),
            };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiBearerAuth()
    @ApiOperation({ summary: '用户登出' })
    @ApiBody({
        schema: {
            properties: {
                refreshToken: { type: 'string', description: '刷新令牌' }
            },
            required: ['refreshToken']
        }
    })
    @ApiResponse({
        status: 200,
        description: '登出成功',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '登出成功' }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: '未授权'
    })
    async logout(@Req() req: Request, @Body() body: { refreshToken: string }) {
        try {
            const user = req.user as any;
            await this.logoutUserUseCase.execute({
                userId: user.userId,
                refreshToken: body.refreshToken
            });

            return {
                success: true,
                message: '登出成功',
            };
        } catch (error: unknown) {
            return {
                success: false,
                message: this.getErrorMessage(error) || '登出失败',
            };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: '更新用户资料' })
    @ApiBody({ type: UpdateUserProfileDto })
    @ApiResponse({
        status: 200,
        description: '更新成功',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
                        email: { type: 'string', example: 'user@example.com' },
                        username: { type: 'string', example: 'username' },
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: '更新失败',
        schema: {
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: '用户名已被使用' }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: '未授权'
    })
    async updateProfile(@Req() req: Request, @Body() dto: Partial<UpdateUserProfileDto>) {
        try {
            const user = req.user as any;
            const updateDto: UpdateUserProfileDto = {
                userId: user.userId,
                ...dto,
            };

            const result = await this.updateUserProfileUseCase.execute(updateDto);
            return {
                success: true,
                data: {
                    id: result.id,
                    email: result.email,
                    username: result.username,
                },
            };
        } catch (error: unknown) {
            return {
                success: false,
                message: this.getErrorMessage(error),
            };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('change-password')
    @ApiBearerAuth()
    @ApiOperation({ summary: '修改密码' })
    @ApiBody({
        schema: {
            properties: {
                currentPassword: { type: 'string', description: '当前密码' },
                newPassword: { type: 'string', description: '新密码' }
            },
            required: ['currentPassword', 'newPassword']
        }
    })
    @ApiResponse({
        status: 200,
        description: '密码修改成功',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '密码修改成功' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: '密码修改失败',
        schema: {
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: '当前密码错误' }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: '未授权'
    })
    async changePassword(@Req() req: Request, @Body() dto: Omit<ChangePasswordDto, 'userId'>) {
        try {
            const user = req.user as any;
            const changePasswordDto: ChangePasswordDto = {
                userId: user.userId,
                currentPassword: dto.currentPassword,
                newPassword: dto.newPassword,
            };

            await this.changePasswordUseCase.execute(changePasswordDto);
            return {
                success: true,
                message: '密码修改成功',
            };
        } catch (error: unknown) {
            return {
                success: false,
                message: this.getErrorMessage(error),
            };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: '获取用户资料' })
    @ApiResponse({
        status: 200,
        description: '获取成功',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
                        email: { type: 'string', example: 'user@example.com' },
                        username: { type: 'string', example: 'username' },
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: '未授权'
    })
    async getProfile(@Req() req: Request) {
        const user = req.user as any;
        return {
            success: true,
            data: {
                id: user.userId,
                email: user.email,
                username: user.username,
            },
        };
    }

    // 新增的辅助方法，用于安全地提取错误消息
    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        if (typeof error === 'object' && error !== null && 'message' in error) {
            return String((error as { message: unknown }).message);
        }

        return '发生未知错误';
    }
} 