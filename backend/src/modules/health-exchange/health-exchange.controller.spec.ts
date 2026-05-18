import { Test, TestingModule } from '@nestjs/testing';
import { HealthExchangeController } from './health-exchange.controller';

describe('HealthExchangeController', () => {
  let controller: HealthExchangeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthExchangeController],
    }).compile();

    controller = module.get<HealthExchangeController>(HealthExchangeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
