import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller.js';
import { AppService } from './service/app.service.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
