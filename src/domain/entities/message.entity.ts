import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @ManyToOne(() => User, user => user.messages)
    sender: User;

    @Column()
    senderId: string;

    @Column({ nullable: true })
    roomId: string;

    @CreateDateColumn()
    createdAt: Date;
} 