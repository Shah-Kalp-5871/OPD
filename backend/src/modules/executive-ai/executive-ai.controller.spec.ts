import { Test, TestingModule } from '@nestjs/testing';
import { ExecutiveAiController } from './executive-ai.controller';

describe('ExecutiveAiController', () => {
  let controller: ExecutiveAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecutiveAiController],
    }).compile();

    controller = module.get<ExecutiveAiController>(ExecutiveAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
