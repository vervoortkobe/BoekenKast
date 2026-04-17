import { Injectable } from '@nestjs/common';
import { prisma } from '../db/prisma.js';
import { LendingDTO } from '../dto/lending.dto.js';

@Injectable()
export class LendingService {
  async getAllLendings(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'lendingDate',
    sortOrder: 'asc' | 'desc' = 'desc',
    bookId?: string,
  ) {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    const orderBy = { [sortBy]: sortOrder };

    const where = bookId ? { bookId } : {};

    return prisma.lending.findMany({
      where,
      include: { book: true },
      orderBy,
      skip,
      take: parsedLimit,
    });
  }

  getLending(id: string) {
    return prisma.lending.findUnique({ where: { id } });
  }

  createLending(lending: LendingDTO) {
    return prisma.lending.create({
      data: {
        name: lending.name,
        date: lending.date,
        returnDate: lending.returnDate,
        bookId: lending.bookId as string,
      },
    });
  }

  updateLending(id: string, lending: LendingDTO) {
    return prisma.lending.update({
      where: { id },
      data: {
        name: lending.name,
        date: lending.date,
        returnDate: lending.returnDate,
        bookId: lending.bookId as string,
      },
    });
  }

  deleteLending(id: string) {
    return prisma.lending.delete({ where: { id } });
  }
}
