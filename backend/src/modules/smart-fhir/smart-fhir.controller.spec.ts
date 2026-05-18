import { Test, TestingModule } from '@nestjs/testing';
import { SmartFhirController } from './smart-fhir.controller';

describe('SmartFhirController', () => {
  let controller: SmartFhirController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartFhirController],
    }).compile();

    controller = module.get<SmartFhirController>(SmartFhirController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
