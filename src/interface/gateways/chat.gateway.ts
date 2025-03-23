import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageUseCase } from '../../application/usecases/message/create-message.usecase';
import { JwtService } from '@nestjs/jwt';
import { Inject, UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../guards/ws-jwt-auth.guard';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly createMessageUseCase: CreateMessageUseCase,
        private readonly jwtService: JwtService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token);
            client.data.user = payload;
            console.log(`Client connected: ${client.id}`);
        } catch (error) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @UseGuards(WsJwtAuthGuard)
    @SubscribeMessage('send_message')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { content: string; roomId?: string },
    ) {
        const userId = client.data.user.sub;
        const message = await this.createMessageUseCase.execute(
            data.content,
            userId,
            data.roomId
        );

        // 发送消息到特定房间或全局
        if (data.roomId) {
            this.server.to(data.roomId).emit('receive_message', message);
        } else {
            this.server.emit('receive_message', message);
        }

        return message;
    }

    @UseGuards(WsJwtAuthGuard)
    @SubscribeMessage('join_room')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string },
    ) {
        client.join(data.roomId);
        return { success: true, room: data.roomId };
    }

    @UseGuards(WsJwtAuthGuard)
    @SubscribeMessage('leave_room')
    handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string },
    ) {
        client.leave(data.roomId);
        return { success: true, room: data.roomId };
    }
} 