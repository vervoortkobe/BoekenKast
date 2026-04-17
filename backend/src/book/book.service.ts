import { Injectable } from '@nestjs/common';
import { prisma } from '../db/prisma.js';
import { BookDTO } from '../dto/book.dto.js';

@Injectable()
export class BookService {
  async getAllBooks(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'title',
    sortOrder: 'asc' | 'desc' = 'asc',
    typeId?: string,
    seriesId?: string,
    author?: string,
  ) {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    const orderBy = { [sortBy]: sortOrder };

    const where: any = {};
    if (typeId) where.bookTypeId = typeId;
    if (seriesId) where.bookSeriesId = seriesId;
    if (author) where.author = { contains: author, mode: 'insensitive' };

    return prisma.book.findMany({
      where,
      include: { bookType: true, bookSeries: true, lendings: true },
      orderBy,
      skip,
      take: parsedLimit,
    });
  }

  async getBook(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: { bookType: true, bookSeries: true, lendings: true },
    });
  }

  async createBook(book: BookDTO) {
    return prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        color: book.color,
        imageUrl: book.imageUrl,
        bookType: { connect: { id: book.bookTypeId } },
        bookSeries: book.bookSeriesId ? { connect: { id: book.bookSeriesId } } : undefined,
      },
      include: { bookType: true, bookSeries: true },
    });
  }

  async updateBook(id: string, book: BookDTO) {
    return prisma.book.update({
      where: { id },
      data: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        color: book.color,
        imageUrl: book.imageUrl,
        bookType: { connect: { id: book.bookTypeId } },
        bookSeries: book.bookSeriesId ? { connect: { id: book.bookSeriesId } } : { disconnect: true },
      },
      include: { bookType: true, bookSeries: true },
    });
  }

  async deleteBook(id: string) {
    return prisma.book.delete({ where: { id } });
  }
}
