import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { LendingService } from './lending.service.js';
import type { Lending } from '../dto/lending.dto.js';

@Controller('lending')
export class LendingController {
  constructor(private readonly lendingService: LendingService) {}

  @Get()
  async getAllLendings(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'lendingDate',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('bookId') bookId?: number,
  ) {
    return this.lendingService.getAllLendings(
      page,
      limit,
      sortBy,
      sortOrder,
      bookId,
    );
  }

  @Get(':id')
  async getLending(@Param('id') id: number) {
    return this.lendingService.getLending(id);
  }

  @Post()
  async createLending(@Body() lending: Lending) {
    return this.lendingService.createLending(lending);
  }

  @Put(':id')
  async updateLending(@Param('id') id: number, @Body() lending: Lending) {
    return this.lendingService.updateLending(id, lending);
  }

  @Delete(':id')
  async deleteLending(@Param('id') id: number) {
    return this.lendingService.deleteLending(id);
  }
}
