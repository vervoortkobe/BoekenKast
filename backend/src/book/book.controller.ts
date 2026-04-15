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
import { BookService } from './book.service.js';
import type { Book } from '../dto/book.dto.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'title',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('typeId') typeId?: string,
    @Query('seriesId') seriesId?: string,
    @Query('author') author?: string, // Add author filter
  ) {
    return this.bookService.getAllBooks(
      page,
      limit,
      sortBy,
      sortOrder,
      typeId,
      seriesId,
      author,
    );
  }

  @Get(':id')
  async getBook(@Param('id') id: string) {
    return this.bookService.getBook(id);
  }

  @Post()
  async createBook(@Body() book: Book) {
    return this.bookService.createBook(book);
  }

  @Put(':id')
  async updateBook(@Param('id') id: string, @Body() book: Book) {
    return this.bookService.updateBook(id, book);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }
}
