import { Controller, Get, Param, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IMessageRepository } from '../../domain/repositories/message.repository.interface';
import { MESSAGE_REPOSITORY_TOKEN } from '../../domain/constants/injection-tokens';

@Controller('messages')
export class MessageController {
    constructor(
        @Inject(MESSAGE_REPOSITORY_TOKEN)
        private readonly messageRepository: IMessageRepository
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('room/:roomId')
    async getMessagesByRoom(@Param('roomId') roomId: string) {
        return this.messageRepository.findByRoom(roomId);
    }
} 