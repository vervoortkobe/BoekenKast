import { Injectable } from '@nestjs/common';
import { prisma } from '../db/prisma.js';
import { BookSeriesDTO } from '../dto/book-series.dto.js';

@Injectable()
export class BookSeriesService {
  async getAllBookSeries(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    const orderBy = { [sortBy]: sortOrder };

    return prisma.bookSeries.findMany({
      include: { books: true },
      orderBy,
      skip,
      take: parsedLimit,
    });
  }

  async getBookSeries(id: string) {
    return prisma.bookSeries.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  async createBookSeries(bookSeries: BookSeriesDTO) {
    return prisma.bookSeries.create({ data: { name: bookSeries.name } });
  }

  async updateBookSeries(id: string, bookSeries: BookSeriesDTO) {
    return prisma.bookSeries.update({ where: { id }, data: { name: bookSeries.name } });
  }

  async deleteBookSeries(id: string) {
    return prisma.bookSeries.delete({ where: { id } });
  }
}
