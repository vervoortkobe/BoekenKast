import { Injectable } from '@nestjs/common';
import { prisma } from '../db/prisma.js';
import { Book } from '../dto/book.dto.js';

@Injectable()
export class BookService {
  async getAllBooks(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'title',
    sortOrder: 'asc' | 'desc' = 'asc',
    typeId?: number,
    seriesId?: number,
    color?: boolean,
  ) {
    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };

    const where: any = {};
    if (typeId) where.bookTypeId = typeId;
    if (seriesId) where.bookSeriesId = seriesId;
    if (color !== undefined) where.color = color;

    return prisma.book.findMany({
      where,
      include: { bookType: true, bookSeries: true, lendings: true },
      orderBy,
      skip,
      take: limit,
    });
  }

  async getBook(id: number) {
    return prisma.book.findUnique({
      where: { id },
      include: { bookType: true, bookSeries: true, lendings: true },
    });
  }

  async createBook(book: Book) {
    return prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        color: book.color,
        bookType: { connect: { id: book.bookTypeId } },
        bookSeries: { connect: { id: book.bookSeriesId } },
      },
      include: { bookType: true, bookSeries: true },
    });
  }

  async updateBook(id: number, book: Book) {
    return prisma.book.update({
      where: { id },
      data: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        color: book.color,
        bookType: { connect: { id: book.bookTypeId } },
        bookSeries: { connect: { id: book.bookSeriesId } },
      },
      include: { bookType: true, bookSeries: true },
    });
  }

  async deleteBook(id: number) {
    return prisma.book.delete({ where: { id } });
  }
}
