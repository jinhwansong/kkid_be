import { Test, TestingModule } from '@nestjs/testing';
import { AuthVerificationService } from './auth-verification.service';

describe('AuthVerificationService', () => {
  let service: AuthVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthVerificationService],
    }).compile();

    service = module.get<AuthVerificationService>(AuthVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
