import { Injectable } from '@nestjs/common';
import { prisma } from '../db/prisma.js';
import { BookTypeDTO } from '../dto/book-type.dto.js';

@Injectable()
export class BookTypeService {
  async getAllBookTypes(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    const orderBy = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      prisma.bookType.findMany({
        include: { 
          books: {
            include: { lendings: true }
          }
        },
        orderBy,
        skip,
        take: parsedLimit,
      }),
      prisma.bookType.count(),
    ]);

    return { data, total };
  }

  async getBookType(id: string) {
    return prisma.bookType.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  async createBookType(bookType: BookTypeDTO) {
    return prisma.bookType.create({ data: { name: bookType.name } });
  }

  async updateBookType(id: string, bookType: BookTypeDTO) {
    return prisma.bookType.update({ where: { id }, data: { name: bookType.name } });
  }

  async deleteBookType(id: string) {
    return prisma.bookType.delete({ where: { id } });
  }
}
