import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Lending } from './entity/lending.entity';
import { LendingService } from './lending.service';

@Controller('lending')
export class LendingController {
  constructor(private lendingService: LendingService) {}

  @Post()
  async create(@Body() lending: Lending): Promise<Lending> {
    return await this.lendingService.create(lending);
  }

  @Patch(':address')
  async update(
    @Param('address') address: string,
    @Body() lending: Lending,
  ): Promise<Lending> {
    return await this.lendingService.update(address, lending);
  }

  @Get()
  async findAll(): Promise<Lending[]> {
    return this.lendingService.findAll();
  }
  @Get(':address')
  async findOne(@Param('address') address: string): Promise<Lending> {
    return this.lendingService.findOne(address);
  }
}
