import { Injectable, NotFoundException } from '@nestjs/common';
import { Lending } from './entity/lending.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm';

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
     
      return  await this.lendingRepository.save(newLending);
       
    }
  }

  async update(address: string, lending: Lending): Promise<Lending> {
    const findAddress = await this.findOne(address);
    if (!findAddress) {
      throw new NotFoundException('해당 address는 존재하지 않습니다');
    }

    let borrow = findAddress.borrow
    let deposit = findAddress.deposit
    let referral = findAddress.referral
    if(lending.borrow){
      borrow = lending.borrow + findAddress.borrow
    }

    if(lending.deposit){
      deposit = lending.deposit + findAddress.deposit
    }

    if(lending.referral){
      referral = lending.referral + findAddress.referral
    }
    const total = borrow + deposit + referral

    lending.total = total
    lending.borrow = borrow
    lending.deposit = deposit
    lending.referral = referral
   
    await this.lendingRepository.update({ address: address }, lending);
    await this.updateRank()
    return await this.findOne(address);
  }

  async updateRank() {
    const allData = await this.findAll()
 
    allData.map(async (data,index) => {  
      await this.lendingRepository.update({address:data.address},{rank:index+1})
    });
    

  }

  async findAll(): Promise<Lending[]> {
    return this.lendingRepository.find({order: {
      total: "DESC" 
    }});
  }

  async findOne(address: string): Promise<Lending> {
   
    return await this.lendingRepository.findOne({
      where: {
        address,
      },
    });
  }
}
