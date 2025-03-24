import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Message } from './message.entity';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: '用户ID' })
    private readonly _id: string;

    @Column({ unique: true })
    @ApiProperty({ description: '用户名' })
    private _username: string;

    @Column()
    @ApiProperty({ description: '电子邮箱' })
    private _email: string;

    @Column({ nullable: true })
    @ApiProperty({ description: '密码', required: false })
    private _password: string;

    @Column({ nullable: true })
    @ApiProperty({ description: '显示名称' })
    private _displayName: string;

    @CreateDateColumn()
    private _createdAt: Date;

    @UpdateDateColumn()
    private _updatedAt: Date;

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

    constructor(
        email: string,
        username: string,
        password: string,
        id?: string,
        isActive?: boolean,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        this._id = id || uuidv4();
        this._email = email;
        this._username = username;
        this._password = password;
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt || new Date();
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get username(): string {
        return this._username;
    }

    get password(): string {
        return this._password;
    }

    get isActive(): boolean {
        return true; // Assuming the user is active by default
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get displayName(): string {
        return this._displayName;
    }

    // Methods
    updateUsername(username: string): void {
        this._username = username;
        this._updatedAt = new Date();
    }

    updateEmail(email: string): void {
        this._email = email;
        this._updatedAt = new Date();
    }

    updatePassword(password: string): void {
        this._password = password;
        this._updatedAt = new Date();
    }

    deactivate(): void {
        // Implementation needed
    }

    activate(): void {
        // Implementation needed
    }

    // 创建用户实体的工厂方法
    static create(
        email: string,
        username: string,
        password: string,
    ): User {
        return new User(email, username, password);
    }
} 