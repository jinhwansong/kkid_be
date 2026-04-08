import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MuxService } from './mux.service';

describe('MuxService', () => {
  let service: MuxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MuxService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((k: string) => {
              if (k === 'MUX_ACCESS_TOKEN') return 'id';
              if (k === 'MUX_SECRET_KEY') return 'secret';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MuxService>(MuxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
