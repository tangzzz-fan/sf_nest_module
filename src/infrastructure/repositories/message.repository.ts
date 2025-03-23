import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../domain/entities/message.entity';
import { IMessageRepository } from '../../domain/repositories/message.repository.interface';

@Injectable()
export class MessageRepository implements IMessageRepository {
    constructor(
        @InjectRepository(Message)
        private readonly repository: Repository<Message>,
    ) { }

    async findById(id: string): Promise<Message | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['sender']
        });
    }

    async findByRoom(roomId: string): Promise<Message[]> {
        return this.repository.find({
            where: { roomId },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
        });
    }

    async create(messageData: Partial<Message>): Promise<Message> {
        const message = this.repository.create(messageData);
        return message;
    }

    async save(message: Message): Promise<Message> {
        return this.repository.save(message);
    }
} 