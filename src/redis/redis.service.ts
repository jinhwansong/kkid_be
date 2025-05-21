import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  // 레디스를 전역으로 관리 및 각각의 서비스에서 관리 하기 위해 사용된다.
  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    this.client.on('error', (err) => {
      console.error(`❌ Redis 연결 오류: ${err}`);
    });
    this.client.connect();
  }
  // 조회수용 유저 정보 저장 30분후 자동 삭제...
  async saveCount(key: string, value: string) {
    await this.client.set(key, value, { EX: 1800 });
  }
  // 키가 있누?
  async existsCount(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }
}
