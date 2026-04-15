import { Injectable } from '@nestjs/common';
import { prisma } from '../db/prisma.js';
import { BookType } from '../dto/book-type.dto.js';

@Injectable()
export class BookTypeService {
  async getAllBookTypes(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };

    return prisma.bookType.findMany({
      include: { books: true },
      orderBy,
      skip,
      take: limit,
    });
  }

  async getBookType(id: string) {
    return prisma.bookType.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  async createBookType(bookType: BookType) {
    return prisma.bookType.create({ data: bookType });
  }

  async updateBookType(id: string, bookType: BookType) {
    return prisma.bookType.update({ where: { id }, data: bookType });
  }

  async deleteBookType(id: string) {
    return prisma.bookType.delete({ where: { id } });
  }
}
