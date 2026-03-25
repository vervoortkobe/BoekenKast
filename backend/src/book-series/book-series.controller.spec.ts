import { Test, TestingModule } from '@nestjs/testing';
import { BookSeriesController } from './book-series.controller.js';

describe('BookSeriesController', () => {
  let controller: BookSeriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookSeriesController],
    }).compile();

    controller = module.get<BookSeriesController>(BookSeriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
