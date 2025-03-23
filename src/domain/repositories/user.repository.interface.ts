import { User } from '../entities/user.entity';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    create(user: Partial<User>): Promise<User>;
    save(user: User): Promise<User>;
} 