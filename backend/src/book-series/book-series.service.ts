import { Injectable } from '@nestjs/common';
import { prisma } from '../db/prisma.js';
import { BookSeries } from '../dto/book-series.dto.js';

@Injectable()
export class BookSeriesService {
  async getAllBookSeries(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };

    return prisma.bookSeries.findMany({
      include: { books: true },
      orderBy,
      skip,
      take: limit,
    });
  }

  async getBookSeries(id: number) {
    return prisma.bookSeries.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  async createBookSeries(bookSeries: BookSeries) {
    return prisma.bookSeries.create({ data: bookSeries });
  }

  async updateBookSeries(id: number, bookSeries: BookSeries) {
    return prisma.bookSeries.update({ where: { id }, data: bookSeries });
  }

  async deleteBookSeries(id: number) {
    return prisma.bookSeries.delete({ where: { id } });
  }
}
