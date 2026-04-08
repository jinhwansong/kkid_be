import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private readonly log = new Logger(RedisService.name);
  private client: RedisClientType | null = null;
  private isConnected = false;

  constructor() {
    const url = this.resolveRedisUrl();
    if (!url) {
      this.log.warn(
        'Redis 미사용 — 이메일 코드는 프로세스 메모리, 조회수 중복 방지는 비활성',
      );
      return;
    }

    this.client = createClient({ url });
    this.client.on('error', (err) => {
      this.log.error(`Redis 연결 오류: ${err}`);
      this.isConnected = false;
    });
    this.client.on('connect', () => {
      this.log.log('Redis 연결 성공');
      this.isConnected = true;
    });

    void this.initialize();
  }

  private resolveRedisUrl(): string | null {
    if (process.env.REDIS_DISABLED === 'true') {
      return null;
    }
    const single = process.env.REDIS_URL?.trim();
    if (single) {
      return single;
    }
    const host = process.env.REDIS_HOST?.trim();
    if (!host) {
      return null;
    }
    const port = process.env.REDIS_PORT?.trim() || '6379';
    const password = process.env.REDIS_PASSWORD;
    if (password) {
      const user = process.env.REDIS_USER?.trim() || 'default';
      return `redis://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}`;
    }
    return `redis://${host}:${port}`;
  }

  private async initialize() {
    if (!this.client) return;
    try {
      await this.client.connect();
    } catch (error) {
      this.log.error('Redis 초기화 실패', error instanceof Error ? error.stack : error);
      this.isConnected = false;
    }
  }

  async saveCount(key: string, value: string) {
    if (!this.client || !this.isConnected) {
      return;
    }
    try {
      await this.client.set(key, value, { EX: 60 * 60 * 24 });
    } catch (error) {
      this.log.error('Redis 저장 실패', error);
    }
  }

  async existsCount(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.log.error('Redis 조회 실패', error);
      return false;
    }
  }

  /** 이메일 인증 등 TTL 키 */
  async setEx(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.set(key, value, { EX: ttlSeconds });
    } catch (e) {
      this.log.error('Redis setEx 실패', e);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) return null;
    try {
      return await this.client.get(key);
    } catch (e) {
      this.log.error('Redis get 실패', e);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.del(key);
    } catch (e) {
      this.log.error('Redis del 실패', e);
    }
  }
}
