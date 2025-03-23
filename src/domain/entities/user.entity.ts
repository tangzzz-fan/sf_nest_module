import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Message } from './message.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: '用户ID' })
    id: string;

    @Column({ unique: true })
    @ApiProperty({ description: '用户名' })
    username: string;

    @Column()
    @ApiProperty({ description: '电子邮箱' })
    email: string;

    @Column({ nullable: true })
    @ApiProperty({ description: '密码', required: false })
    password?: string;

    @Column({ nullable: true })
    @ApiProperty({ description: '显示名称' })
    displayName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];
} 