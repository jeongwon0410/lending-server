import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Lending } from './entity/lending.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LendingService {
  constructor(
    @InjectRepository(Lending)
    private lendingRepository: Repository<Lending>,
  ) {}

  async create(lending: Lending): Promise<Lending> {
    const lend = await this.findOne(lending.address);
    if (!lend) {
      const newLending = this.lendingRepository.create(lending);

      await this.lendingRepository.save(newLending);
      await this.updateRank();

      return this.findOne(lending.address);
    }
  }

  async update(address: string, lending: Lending): Promise<Lending> {
    const findAddress = await this.findOne(address);
    if (!findAddress) {
      throw new NotFoundException('해당 address는 존재하지 않습니다');
    }

    let borrow = findAddress.borrow;
    let deposit = findAddress.deposit;
    let referral = findAddress.referral;
    if (lending.borrow) {
      borrow = lending.borrow + findAddress.borrow;
    }

    if (lending.deposit) {
      deposit = lending.deposit + findAddress.deposit;
    }

    if (lending.referral) {
      referral = lending.referral + findAddress.referral;
    }
    const total = borrow + deposit + referral;

    lending.total = total;
    lending.borrow = borrow;
    lending.deposit = deposit;
    lending.referral = referral;

    await this.lendingRepository.update({ address: address }, lending);
    await this.updateRank();
    return await this.findOne(address);
  }

  async updateRank() {
    const allData = await this.findAll();

    allData.map(async (data, index) => {
      await this.lendingRepository.update(
        { address: data.address },
        { rank: index + 1 },
      );
    });
  }

  async init() {
    const allData = await this.findAll();

    const allAddress = allData.map((data) => data.address);
    await this.lendingRepository
      .createQueryBuilder()
      .update()
      .set({ rank: 1, total: 0 })
      .where({ address: In(allAddress) })
      .execute();
  }

  async findAll(): Promise<Lending[]> {
    return this.lendingRepository.find({
      order: {
        total: 'DESC',
      },
    });
  }

  async findOne(address: string): Promise<Lending> {
    return await this.lendingRepository.findOne({
      where: {
        address,
      },
    });
  }
  private readonly logger = new Logger(LendingService.name);
  @Cron('0 0 0 * * *') // 매 45초마다 실행됨
  async handleCron() {
    this.logger.debug('init total point');
    await this.init();
  }
}
