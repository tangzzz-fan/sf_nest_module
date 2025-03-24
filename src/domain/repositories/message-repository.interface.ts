import { Message } from '../entities/message.entity';

export interface IMessageRepository {
    findById(id: string): Promise<Message | null>;
    findByUser(userId: string): Promise<Message[]>;
    create(message: Message): Promise<Message>;
    update(message: Message): Promise<Message>;
    delete(id: string): Promise<void>;
} 