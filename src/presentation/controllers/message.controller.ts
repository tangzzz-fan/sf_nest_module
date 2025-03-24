import { Controller, Post, Body, UseGuards, Get, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('消息')
@Controller('messages')
export class MessageController {
    constructor() { }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: '获取消息列表' })
    @ApiResponse({
        status: 200,
        description: '获取成功',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            content: { type: 'string' },
                            sender: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    username: { type: 'string' }
                                }
                            },
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    }
                }
            }
        }
    })
    async getMessages() {
        // 暂时返回空数组，后续实现
        return {
            success: true,
            data: []
        };
    }

    // 其他接口待实现
} 