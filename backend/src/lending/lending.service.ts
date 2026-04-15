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

  getLending(id: string) {
    return prisma.lending.findUnique({ where: { id } });
  }

  createLending(lending: LendingDTO) {
    return prisma.lending.create({ data: lending });
  }

  updateLending(id: string, lending: LendingDTO) {
    return prisma.lending.update({ where: { id }, data: lending });
  }

  deleteLending(id: string) {
    return prisma.lending.delete({ where: { id } });
  }
}
