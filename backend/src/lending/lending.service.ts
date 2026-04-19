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
    let orderBy: any = { [sortBy]: sortOrder };
    if (sortBy === 'bookTitle') {
      orderBy = { book: { title: sortOrder } };
    }

    const where = bookId ? { bookId } : {};

    const [data, total] = await Promise.all([
      prisma.lending.findMany({
        where,
        include: { book: true },
        orderBy,
        skip,
        take: parsedLimit,
      }),
      prisma.lending.count({ where }),
    ]);

    return { data, total };
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
        returnedAt: lending.returnedAt ? new Date(lending.returnedAt) : null,
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
        returnedAt: lending.returnedAt ? new Date(lending.returnedAt) : (lending.returnedAt === null ? null : undefined),
        bookId: lending.bookId as string,
      },
    });
  }

  deleteLending(id: string) {
    return prisma.lending.delete({ where: { id } });
  }
}
