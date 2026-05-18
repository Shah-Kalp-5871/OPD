import { Test, TestingModule } from '@nestjs/testing';
import { SmartFhirService } from './smart-fhir.service';

describe('SmartFhirService', () => {
  let service: SmartFhirService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartFhirService],
    }).compile();

    service = module.get<SmartFhirService>(SmartFhirService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
