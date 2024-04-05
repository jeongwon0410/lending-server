import { Test, TestingModule } from '@nestjs/testing';
import { LendingController } from './lending.controller';

describe('LendingController', () => {
  let controller: LendingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LendingController],
    }).compile();

    controller = module.get<LendingController>(LendingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
