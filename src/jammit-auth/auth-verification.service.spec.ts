import { JammitUser } from '@/database/entities';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthVerificationService } from './auth-verification.service';
import { JammitJwtService } from './jammit-jwt.service';

describe('AuthVerificationService', () => {
  let service: AuthVerificationService;
  let jwt: { verifyAccessToken: jest.Mock };
  let repo: { findOne: jest.Mock };

  beforeEach(async () => {
    jwt = {
      verifyAccessToken: jest.fn().mockReturnValue({ loginId: 'u@test.com' }),
    };
    repo = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthVerificationService,
        { provide: JammitJwtService, useValue: jwt },
        { provide: getRepositoryToken(JammitUser), useValue: repo },
      ],
    }).compile();

    service = module.get<AuthVerificationService>(AuthVerificationService);
  });

  it('verifyTokenAndGetUser returns profile and jammitUser', async () => {
    const jammit = {
      id: 9,
      email: 'u@test.com',
      username: 'un',
      nickname: 'nick',
      profileImagePath: '/p',
      preferredGenres: [],
      userBandSessions: [],
    } as JammitUser;
    repo.findOne.mockResolvedValue(jammit);

    const out = await service.verifyTokenAndGetUser('BearerToken');

    expect(out.jammitUser).toBe(jammit);
    expect(out.profile.email).toBe('u@test.com');
    expect(out.profile.id).toBe(9);
  });

  it('throws when user missing', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(
      service.verifyTokenAndGetUser('t'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
