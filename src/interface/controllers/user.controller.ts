import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
// ... 其他导入 ...

@ApiTags('用户')
@ApiBearerAuth()
@Controller('users')
export class UserController {
    constructor(
        // ... 依赖注入 ...
    ) { }

    @Post()
    @ApiOperation({ summary: '创建用户' })
    @ApiResponse({ status: 201, description: '用户创建成功', type: User })
    @ApiResponse({ status: 400, description: '无效的请求数据' })
    async createUser(@Body() createUserDto: CreateUserDto) {
        // ... 实现创建用户逻辑 ...
    }

    @Get()
    @ApiOperation({ summary: '获取所有用户' })
    @ApiResponse({ status: 200, description: '返回所有用户列表', type: [User] })
    async findAll() {
        // ... 实现获取所有用户逻辑 ...
    }

    @Get(':id')
    @ApiOperation({ summary: '获取单个用户' })
    @ApiResponse({ status: 200, description: '返回指定用户', type: User })
    @ApiResponse({ status: 404, description: '用户未找到' })
    async findOne(@Param('id') id: string) {
        // ... 实现获取单个用户逻辑 ...
    }

    // ... 其他方法 ...
} 