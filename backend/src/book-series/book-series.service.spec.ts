import { Test, TestingModule } from '@nestjs/testing';
import { BookSeriesService } from './book-series.service.js';

describe('BookSeriesService', () => {
  let service: BookSeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookSeriesService],
    }).compile();

    service = module.get<BookSeriesService>(BookSeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
