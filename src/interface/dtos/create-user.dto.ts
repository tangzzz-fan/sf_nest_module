import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: '用户名', example: 'johndoe' })
    username: string;

    @ApiProperty({ description: '电子邮箱', example: 'john@example.com' })
    email: string;

    @ApiProperty({ description: '密码', example: 'password123' })
    password: string;
} 