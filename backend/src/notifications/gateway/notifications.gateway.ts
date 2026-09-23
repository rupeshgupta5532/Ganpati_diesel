import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../redis/redis.service';

@Injectable()
@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');

    // Subscribe to Redis Pub/Sub for cross-instance broadcasts
    this.redisService.subscribe('notifications', (message) => {
      const payload = JSON.parse(message);
      if (payload.room) {
        this.server.to(payload.room).emit('notification', payload.data);
      }
    });
  }

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader) throw new UnauthorizedException('Missing token');

      const token = authHeader.split(' ')[1];
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'super-secret',
      });

      const role = payload.role;
      const userId = payload.sub;

      client.data.user = payload;

      // Join specific room
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        client.join('admin-room');
        this.logger.log(`Admin ${userId} joined admin-room`);
      } else {
        client.join(`user:${userId}`);
        this.logger.log(`User ${userId} joined user:${userId}`);
      }
    } catch (error) {
      this.logger.warn('Unauthorized WebSocket connection attempt');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
