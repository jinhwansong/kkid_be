import { Gathering, JammitUser } from '@/database/entities';
import { OauthPlatform } from '@/jammit-shared/jammit.enums';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JammitAuthService } from './jammit-auth.service';
import { JammitJwtService } from './jammit-jwt.service';

describe('JammitAuthService', () => {
  let service: JammitAuthService;
  let userRepo: { findOne: jest.Mock };
  let gatheringRepo: { count: jest.Mock };
  let jwt: {
    createAccessToken: jest.Mock;
    createRefreshToken: jest.Mock;
    getAccessTokenExpiredAt: jest.Mock;
  };

  beforeEach(async () => {
    userRepo = { findOne: jest.fn() };
    gatheringRepo = { count: jest.fn().mockResolvedValue(0) };
    jwt = {
      createAccessToken: jest.fn().mockReturnValue('at'),
      createRefreshToken: jest.fn().mockReturnValue('rt'),
      getAccessTokenExpiredAt: jest.fn().mockReturnValue(new Date('2030-01-01')),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JammitAuthService,
        { provide: getRepositoryToken(JammitUser), useValue: userRepo },
        { provide: getRepositoryToken(Gathering), useValue: gatheringRepo },
        { provide: JammitJwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<JammitAuthService>(JammitAuthService);
  });

  it('login throws when email unknown', async () => {
    userRepo.findOne.mockResolvedValue(null);
    await expect(service.login('x@y.com', 'pw')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('login returns tokens when password ok', async () => {
    const hash = await bcrypt.hash('secret', 4);
    const user = {
      id: 1,
      email: 'ok@test.com',
      password: hash,
      oauthPlatform: OauthPlatform.NONE,
      username: 'a',
      nickname: 'b',
      profileImagePath: null,
      preferredGenres: [],
      userBandSessions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as JammitUser;

    userRepo.findOne.mockResolvedValue(user);

    const out = await service.login('ok@test.com', 'secret');

    expect(out.accessToken).toBe('at');
    expect(out.refreshToken).toBe('rt');
    expect(out.user.email).toBe('ok@test.com');
    expect(out.user.totalCreatedGatheringCount).toBe(0);
    expect(out.user.completedGatheringCount).toBe(0);
  });
});
