export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'chat_db',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secret_key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
}); 