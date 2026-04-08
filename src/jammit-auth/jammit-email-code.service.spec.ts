import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '@/redis/redis.service';
import {
  AuthCodeVerifyResult,
  JammitEmailCodeService,
} from './jammit-email-code.service';

describe('JammitEmailCodeService', () => {
  let service: JammitEmailCodeService;
  let redis: { setEx: jest.Mock; get: jest.Mock; del: jest.Mock };

  beforeEach(async () => {
    redis = {
      setEx: jest.fn().mockResolvedValue(undefined),
      get: jest.fn(),
      del: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JammitEmailCodeService,
        { provide: RedisService, useValue: redis },
      ],
    }).compile();

    service = module.get<JammitEmailCodeService>(JammitEmailCodeService);
  });

  it('verifyCodeHttp returns 200 on SUCCESS', async () => {
    redis.get.mockResolvedValue('123456');
    const out = await service.verifyCodeHttp('e@test.com', '123456');
    expect(out.statusCode).toBe(200);
    expect(out.body.success).toBe(true);
    expect(out.body.result?.success).toBe(true);
  });

  it('verifyCodeHttp returns 401 on INVALID', async () => {
    redis.get.mockResolvedValue('111111');
    const out = await service.verifyCodeHttp('e@test.com', '999999');
    expect(out.statusCode).toBe(401);
    expect(out.body.success).toBe(false);
  });

  it('verifyCode returns NOT_FOUND when no code stored', async () => {
    redis.get.mockResolvedValue(null);
    const r = await service.verifyCode('none@test.com', '1');
    expect(r).toBe(AuthCodeVerifyResult.NOT_FOUND);
  });
});
