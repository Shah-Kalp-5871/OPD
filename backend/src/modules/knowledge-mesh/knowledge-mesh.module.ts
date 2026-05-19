import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { MedicalOntologyService } from './services/medical-ontology.service';
import { SemanticInferenceService } from './services/semantic-inference.service';
import { KnowledgeGraphService } from './services/knowledge-graph.service';
import { KnowledgeMeshController } from './knowledge-mesh.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [MedicalOntologyService, SemanticInferenceService, KnowledgeGraphService],
  controllers: [KnowledgeMeshController],
  exports: [MedicalOntologyService, SemanticInferenceService, KnowledgeGraphService],
})
export class KnowledgeMeshModule {}
