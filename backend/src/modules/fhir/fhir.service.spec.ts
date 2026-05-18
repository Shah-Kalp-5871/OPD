import { Test, TestingModule } from '@nestjs/testing';
import { FhirService } from './fhir.service';
import { PrismaService } from '../../prisma/prisma.service';
import { FhirMapper } from './mappers/fhir.mapper';
import { TelemetryService } from '../../metrics/telemetry.service';
import { getQueueToken } from '@nestjs/bullmq';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('FhirService', () => {
  let service: FhirService;
  let prisma: PrismaService;
  let mapper: FhirMapper;
  let telemetry: TelemetryService;
  let queue: any;

  const mockPrisma = {
    patient: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    patientCase: {
      findFirst: jest.fn(),
    },
    patientVitals: {
      create: jest.fn(),
    },
    fhirExportJob: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    patientConsent: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    terminologyConcept: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockMapper = {
    mapPatientToFhir: jest.fn(),
    mapEncounterToFhir: jest.fn(),
    mapVitalsToObservation: jest.fn(),
  };

  const mockTelemetry = {
    incrementFhirRequests: jest.fn(),
    incrementFhirValidationFailures: jest.fn(),
    incrementHl7MessagesParsed: jest.fn(),
    incrementHl7DeadLetterQueue: jest.fn(),
    recordBulkExportDuration: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FhirService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: FhirMapper, useValue: mockMapper },
        { provide: TelemetryService, useValue: mockTelemetry },
        { provide: getQueueToken('fhir-export'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<FhirService>(FhirService);
    prisma = module.get<PrismaService>(PrismaService);
    mapper = module.get<FhirMapper>(FhirMapper);
    telemetry = module.get<TelemetryService>(TelemetryService);
    queue = module.get<any>(getQueueToken('fhir-export'));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCapabilityStatement', () => {
    it('should return CapabilityStatement metadata', async () => {
      const statement = await service.getCapabilityStatement();
      expect(statement.resourceType).toBe('CapabilityStatement');
      expect(statement.status).toBe('active');
      expect(statement.fhirVersion).toBe('4.0.1');
    });
  });

  describe('searchTerminology', () => {
    it('should return matched terms', async () => {
      const matched = [{ code: 'E11.9', display: 'Type 2 diabetes mellitus' }];
      mockPrisma.terminologyConcept.findMany.mockResolvedValue(matched);

      const results = await service.searchTerminology('diabetes');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0].code).toBe('E11.9');
    });
  });

  describe('lookupIcd10', () => {
    it('should return ICD-10 code lookup description if found', async () => {
      const concept = { code: 'E11.9', system: 'ICD-10', display: 'Type 2 diabetes mellitus' };
      mockPrisma.terminologyConcept.findUnique.mockResolvedValue(concept);

      const result = await service.lookupIcd10('E11.9');
      expect(result.code).toBe('E11.9');
      expect(result.display).toBe('Type 2 diabetes mellitus');
    });

    it('should throw NotFoundException if code not found', async () => {
      mockPrisma.terminologyConcept.findUnique.mockResolvedValue(null);
      await expect(service.lookupIcd10('INVALID_CODE')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPatientFhir', () => {
    it('should return mapped FHIR Patient if found', async () => {
      const patient = { id: 'patient-1', firstName: 'John', lastName: 'Doe', mobile: '9876543210', gender: 'Male' };
      mockPrisma.patient.findUnique.mockResolvedValue(patient);
      mockPrisma.patient.findFirst.mockResolvedValue(patient);
      mockMapper.mapPatientToFhir.mockReturnValue({ resourceType: 'Patient', id: 'patient-1' });

      const result = await service.getPatientFhir('patient-1', 'tenant-1');
      expect(result.resourceType).toBe('Patient');
      expect(result.id).toBe('patient-1');
      expect(prisma.patient.findUnique).toHaveBeenCalledWith({
        where: { id: 'patient-1' },
        include: { profile: true },
      });
    });

    it('should throw NotFoundException if patient not found', async () => {
      mockPrisma.patient.findUnique.mockResolvedValue(null);
      await expect(service.getPatientFhir('patient-2', 'tenant-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPatientFhir', () => {
    it('should create and return mapped FHIR patient', async () => {
      const payload = {
        resourceType: 'Patient',
        name: [{ family: 'Doe', given: ['John'] }],
        telecom: [{ system: 'phone', value: '9876543210' }],
        gender: 'male',
        birthDate: '1990-01-01',
      };
      const createdPatient = { id: 'patient-1', firstName: 'John', lastName: 'Doe', mobile: '9876543210', gender: 'Male' };
      mockPrisma.patient.create.mockResolvedValue(createdPatient);
      mockMapper.mapPatientToFhir.mockReturnValue({ resourceType: 'Patient', id: 'patient-1' });

      const result = await service.createPatientFhir(payload, 'tenant-1');
      expect(result.resourceType).toBe('Patient');
      expect(prisma.patient.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if payload is invalid', async () => {
      const invalidPayload = { resourceType: 'Patient', name: [] };
      await expect(service.createPatientFhir(invalidPayload, 'tenant-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getEncounterFhir', () => {
    it('should return mapped FHIR Encounter if found', async () => {
      const patientCase = { id: 'case-1', caseNumber: 'C1', branchId: 'b1' };
      mockPrisma.patientCase.findFirst.mockResolvedValue(patientCase);
      mockMapper.mapEncounterToFhir.mockReturnValue({ resourceType: 'Encounter', id: 'case-1' });

      const result = await service.getEncounterFhir('case-1', 'tenant-1');
      expect(result.resourceType).toBe('Encounter');
      expect(prisma.patientCase.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException if case not found', async () => {
      mockPrisma.patientCase.findFirst.mockResolvedValue(null);
      await expect(service.getEncounterFhir('case-2', 'tenant-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createObservationFhir', () => {
    it('should throw BadRequestException if observation payload lacks essential fields', async () => {
      const badPayload = { resourceType: 'Observation' };
      await expect(service.createObservationFhir(badPayload, 'tenant-1')).rejects.toThrow(BadRequestException);
    });
  });
});
