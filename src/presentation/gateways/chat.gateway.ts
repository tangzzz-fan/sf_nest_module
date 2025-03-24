import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('ChatGateway');
    private users: Map<string, string> = new Map(); // socketId -> userId

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        // 移除用户连接信息
        this.users.delete(client.id);
    }

    @SubscribeMessage('authenticate')
    handleAuthenticate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { userId: string, token: string }
    ) {
        // 这里应该验证 token，但现在先简单实现
        this.users.set(client.id, data.userId);
        return { event: 'authenticated', data: { success: true } };
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { content: string, recipientId?: string }
    ) {
        const senderId = this.users.get(client.id);
        if (!senderId) {
            return { event: 'error', data: { message: 'Unauthorized' } };
        }

        // 暂时实现为广播消息
        this.server.emit('newMessage', {
            content: data.content,
            sender: senderId,
            timestamp: new Date().toISOString()
        });

        return { event: 'messageSent', data: { success: true } };
    }
} 