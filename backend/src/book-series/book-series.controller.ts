import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { BookSeriesService } from './book-series.service.js';
import type { BookSeriesDTO } from '../dto/book-series.dto.js';

@Controller('book-series')
export class BookSeriesController {
  constructor(private readonly bookSeriesService: BookSeriesService) {}

  @Get()
  async getAllBookSeries(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('search') search?: string,
  ) {
    return this.bookSeriesService.getAllBookSeries(
      page,
      limit,
      sortBy,
      sortOrder,
      search,
    );
  }

  @Get(':id')
  async getBookSeries(@Param('id') id: string) {
    return this.bookSeriesService.getBookSeries(id);
  }

  @Post()
  async createBookSeries(@Body() bookSeries: BookSeriesDTO) {
    return this.bookSeriesService.createBookSeries(bookSeries);
  }

  @Put(':id')
  async updateBookSeries(
    @Param('id') id: string,
    @Body() bookSeries: BookSeriesDTO,
  ) {
    return this.bookSeriesService.updateBookSeries(id, bookSeries);
  }

  @Delete(':id')
  async deleteBookSeries(@Param('id') id: string) {
    return this.bookSeriesService.deleteBookSeries(id);
  }
}
