import { Injectable, ConflictException } from '@nestjs/common';
import { prisma } from '../db/prisma.js';
import { BookSeriesDTO } from '../dto/book-series.dto.js';

@Injectable()
export class BookSeriesService {
  async getAllBookSeries(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
    search?: string,
  ) {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    const orderBy = { [sortBy]: sortOrder };

    const where = search 
      ? { name: { contains: search } }
      : {};

    const [data, total] = await Promise.all([
      prisma.bookSeries.findMany({
        where,
        include: { 
          books: {
            include: { lendings: true }
          } 
        },
        orderBy,
        skip,
        take: parsedLimit,
      }),
      prisma.bookSeries.count({ where }),
    ]);

    return { data, total };
  }

  async getBookSeries(id: string) {
    return prisma.bookSeries.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  async createBookSeries(bookSeries: BookSeriesDTO) {
    const existing = await prisma.bookSeries.findFirst({ where: { name: bookSeries.name } });
    if (existing) {
      throw new ConflictException('Series name already exists');
    }
    return prisma.bookSeries.create({
      data: {
        name: bookSeries.name,
        defaultAuthor: bookSeries.defaultAuthor,
        defaultBookTypeId: bookSeries.defaultBookTypeId,
      },
    });
  }

  async updateBookSeries(id: string, bookSeries: BookSeriesDTO) {
    const existing = await prisma.bookSeries.findFirst({ where: { name: bookSeries.name } });
    if (existing && existing.id !== id) {
      throw new ConflictException('Series name already exists');
    }
    return prisma.bookSeries.update({
      where: { id },
      data: {
        name: bookSeries.name,
        defaultAuthor: bookSeries.defaultAuthor,
        defaultBookTypeId: bookSeries.defaultBookTypeId,
      },
    });
  }

  async deleteBookSeries(id: string) {
    return prisma.bookSeries.delete({ where: { id } });
  }
}
