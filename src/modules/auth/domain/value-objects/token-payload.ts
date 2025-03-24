export class TokenPayload {
    constructor(
        public readonly userId: string,
        public readonly username: string,
        public readonly email: string,
    ) { }
} 