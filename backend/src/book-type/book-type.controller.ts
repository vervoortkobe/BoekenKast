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
import { BookTypeService } from './book-type.service.js';
import type { BookType } from '../dto/book-type.dto.js';

@Controller('book-types')
export class BookTypeController {
  constructor(private readonly bookTypeService: BookTypeService) {}

  @Get()
  async getAllBookTypes(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.bookTypeService.getAllBookTypes(page, limit, sortBy, sortOrder);
  }

  @Get(':id')
  async getBookType(@Param('id') id: number) {
    return this.bookTypeService.getBookType(id);
  }

  @Post()
  async createBookType(@Body() bookType: BookType) {
    return this.bookTypeService.createBookType(bookType);
  }

  @Put(':id')
  async updateBookType(@Param('id') id: number, @Body() bookType: BookType) {
    return this.bookTypeService.updateBookType(id, bookType);
  }

  @Delete(':id')
  async deleteBookType(@Param('id') id: number) {
    return this.bookTypeService.deleteBookType(id);
  }
}
