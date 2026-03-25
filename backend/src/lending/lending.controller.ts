import { Controller, Get } from '@nestjs/common';
import { LendingService } from './lending.service.js';

@Controller('lending')
export class LendingController {
  constructor(private readonly lendingService: LendingService) {}

  @Get()
  getHello(): string {
    return this.lendingService.getAllLendings();
  }
}
