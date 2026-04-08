import { Comment, Video } from '@/database/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            createQueryBuilder: jest.fn(() => qb),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Video),
          useValue: { findOneByOrFail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getComment returns paginated shape', async () => {
    const out = await service.getComment('video-uuid', 1, 10);
    expect(out.totalCount).toBe(0);
    expect(out.data).toEqual([]);
    expect(out.message).toContain('댓글');
  });
});
