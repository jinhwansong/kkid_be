import { Injectable } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService {
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    
    this.client.on('error', (err) => {
      console.error(`❌ Redis 연결 오류: ${err}`);
      this.isConnected = false;
    });
    
    this.client.on('connect', () => {
      console.log('✅ Redis 연결 성공');
      this.isConnected = true;
    });

    this.initialize();
  }

  private async initialize() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Redis 초기화 실패:', error);
      this.isConnected = false;
    }
  }

  async saveCount(key: string, value: string) {
    if (!this.isConnected) {
      console.warn('Redis 연결되지 않음, 건너뜀');
      return;
    }
    try {
      await this.client.set(key, value, { EX: 60 * 60 * 24 });
    } catch (error) {
      console.error('Redis 저장 실패:', error);
    }
  }

  async existsCount(key: string): Promise<boolean> {
    if (!this.isConnected) {
      console.warn('Redis 연결되지 않음, false 반환');
      return false;
    }
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis 조회 실패:', error);
      return false; // 에러 시 false 반환하여 조회수는 증가하도록
    }
  }
}