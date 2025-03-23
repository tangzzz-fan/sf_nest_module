import { Injectable, Inject } from '@nestjs/common';
import { IMessageRepository } from '../../../domain/repositories/message.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { Message } from '../../../domain/entities/message.entity';
import { MESSAGE_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from '../../../domain/constants/injection-tokens';

@Injectable()
export class CreateMessageUseCase {
    constructor(
        @Inject(MESSAGE_REPOSITORY_TOKEN)
        private readonly messageRepository: IMessageRepository,
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(content: string, userId: string, roomId?: string): Promise<Message> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const message = await this.messageRepository.create({
            content,
            senderId: userId,
            roomId,
        });

        return this.messageRepository.save(message);
    }
} 