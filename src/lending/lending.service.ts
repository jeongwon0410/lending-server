import { Injectable, NotFoundException } from '@nestjs/common';
import { Lending } from './entity/lending.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LendingService {
  constructor(
    @InjectRepository(Lending)
    private lendingRepository: Repository<Lending>,
  ) {}

  async create(lending: Lending): Promise<Lending> {
    const address = await this.findOne(lending.address);
    if (!address) {
      const newLending = this.lendingRepository.create(lending);
      return await this.lendingRepository.save(newLending);
    }
  }

  async update(address: string, lending: Lending): Promise<Lending> {
    const findAddress = await this.findOne(address);
    if (!findAddress) {
      throw new NotFoundException('해당 address는 존재하지 않습니다');
    }

    await this.lendingRepository.update({ address: address }, lending);
    return await this.findOne(address);
  }

  async findAll(): Promise<Lending[]> {
    return this.lendingRepository.find();
  }

  async findOne(address: string): Promise<Lending> {
    return await this.lendingRepository.findOne({
      where: {
        address,
      },
    });
  }
}
