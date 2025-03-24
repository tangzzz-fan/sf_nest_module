/**
 * 应用程序错误类
 * 用于统一处理应用程序中的错误
 */
export class AppError extends Error {
    constructor(message: string, public readonly code?: string) {
        super(message);
        this.name = 'AppError';
        // 这是为了确保 instanceof 在 TypeScript 中正常工作
        Object.setPrototypeOf(this, AppError.prototype);
    }
} 