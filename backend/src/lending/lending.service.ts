import { Injectable } from '@nestjs/common';
import { prisma } from '../db/prisma.js';
import { Lending } from '../dto/lending.dto.js';

@Injectable()
export class LendingService {
  async getAllLendings(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'lendingDate',
    sortOrder: 'asc' | 'desc' = 'desc',
    bookId?: number,
  ) {
    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };

    const where = bookId ? { bookId } : {};

    return prisma.lending.findMany({
      where,
      include: { book: true },
      orderBy,
      skip,
      take: limit,
    });
  }

  getLending(id: number) {
    return prisma.lending.findUnique({ where: { id } });
  }

  createLending(lending: Lending) {
    return prisma.lending.create({ data: lending });
  }

  updateLending(id: number, lending: Lending) {
    return prisma.lending.update({ where: { id }, data: lending });
  }

  deleteLending(id: number) {
    return prisma.lending.delete({ where: { id } });
  }
}
