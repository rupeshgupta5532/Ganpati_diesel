import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly pubClient: Redis;
  private readonly subClient: Redis;

  constructor(private configService: ConfigService) {
    const url =
      this.configService.get<string>('REDIS_URI') || this.configService.get<string>('REDIS_URI') || 'redis://localhost:6379';
    this.client = new Redis(url);
    this.pubClient = new Redis(url);
    this.subClient = new Redis(url);
    
    this.client.on('error', (err) => {});
    this.pubClient.on('error', (err) => {});
    this.subClient.on('error', (err) => {});
  }

    async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error.message);
      return null;
    }
  }

    async set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null> {
    try {
      if (ttlSeconds) {
        return await this.client.set(key, value, 'EX', ttlSeconds);
      }
      return await this.client.set(key, value);
    } catch (error) {
      console.error('Redis SET error:', error.message);
      return null;
    }
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  // Pub/Sub abstraction
  async publish(channel: string, message: string) {
    try { return await this.pubClient.publish(channel, message); } catch (e) { console.warn('Redis publish failed', e.message); return null; }
  }

  subscribe(channel: string, callback: (message: string) => void) {
    this.subClient.subscribe(channel);
    this.subClient.on('message', (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });
  }

  onModuleDestroy() {
    this.client.quit();
    this.pubClient.quit();
    this.subClient.quit();
  }
}
