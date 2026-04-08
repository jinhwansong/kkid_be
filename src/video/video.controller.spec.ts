import { AuthOptionalGuard } from '@/common/guards/auth-optional.guard';
import { AuthGuard } from '@/common/guards/auth.guard';
import { MuxService } from '@/mux/mux.service';
import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

describe('VideoController', () => {
  let controller: VideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: {
            getVideosWithDetail: jest.fn(),
            getLikeStatus: jest.fn(),
          },
        },
        { provide: MuxService, useValue: { createDirectUpload: jest.fn() } },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AuthOptionalGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<VideoController>(VideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
