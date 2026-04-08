import { Like, Video } from '@/database/entities';
import { MuxService } from '@/mux/mux.service';
import { RedisService } from '@/redis/redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VideoService } from './video.service';

describe('VideoService', () => {
  let service: VideoService;
  let likeRepo: { count: jest.Mock };

  beforeEach(async () => {
    likeRepo = { count: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        { provide: getRepositoryToken(Video), useValue: {} },
        { provide: getRepositoryToken(Like), useValue: likeRepo },
        {
          provide: RedisService,
          useValue: { existsCount: jest.fn(), saveCount: jest.fn() },
        },
        { provide: MuxService, useValue: {} },
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getLikeStatus returns counts', async () => {
    likeRepo.count.mockResolvedValueOnce(7);
    likeRepo.count.mockResolvedValueOnce(0);

    const out = await service.getLikeStatus('vid-1', 42);

    expect(out.likeCount).toBe(7);
    expect(out.liked).toBe(false);
  });
});
