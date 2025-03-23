import { Message } from '../entities/message.entity';

export interface IMessageRepository {
    findById(id: string): Promise<Message | null>;
    findByRoom(roomId: string): Promise<Message[]>;
    create(message: Partial<Message>): Promise<Message>;
    save(message: Message): Promise<Message>;
} 