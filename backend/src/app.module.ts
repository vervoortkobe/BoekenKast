import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BookController } from './book/book.controller.js';
import { BookService } from './book/book.service.js';
import { BookTypeController } from './book-type/book-type.controller.js';
import { BookSeriesController } from './book-series/book-series.controller.js';
import { LendingController } from './lending/lending.controller.js';
import { LendingService } from './lending/lending.service.js';
import { BookSeriesService } from './book-series/book-series.service.js';
import { BookTypeService } from './book-type/book-type.service.js';

@Module({
  imports: [],
  controllers: [AppController, BookController, BookTypeController, BookSeriesController, LendingController],
  providers: [
    AppService,
    BookService,
    LendingService,
    BookSeriesService,
    BookTypeService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
