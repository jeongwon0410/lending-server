import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lending } from './entity/lending.entity';
import { LendingController } from './lending.controller';
import { LendingService } from './lending.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lending])], //해방모듈에서 Cat Entity를 사용하기 위해 Import
  exports: [TypeOrmModule], // 다름 모듈에서도 CatModule의 데이터베이스 설정을 공유하기 위해 export
  controllers: [LendingController],
  providers: [LendingService],
})
export class LendingModule {}
