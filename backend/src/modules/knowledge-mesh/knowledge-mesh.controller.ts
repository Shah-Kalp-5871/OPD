import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { MedicalOntologyService } from './services/medical-ontology.service';
import { SemanticInferenceService } from './services/semantic-inference.service';
import { KnowledgeGraphService } from './services/knowledge-graph.service';

@Controller('knowledge-mesh')
@UseGuards(JwtAuthGuard, TenantGuard)
export class KnowledgeMeshController {
  constructor(
    private readonly ontologyService: MedicalOntologyService,
    private readonly inferenceService: SemanticInferenceService,
    private readonly graphService: KnowledgeGraphService,
  ) {}

  @Get('ontologies')
  async getOntologies() {
    return this.ontologyService.getOntologies();
  }

  @Post('ontologies/:id/toggle')
  async toggleOntology(@Param('id') id: string, @Body() data: any) {
    return this.ontologyService.toggleOntology(id, data.active);
  }

  @Post('inference')
  async runInference(@Body() data: any) {
    return this.inferenceService.runInference(data.contextId, data.queryContext);
  }

  @Get('inference/graphs')
  async getInferenceGraphs() {
    return this.inferenceService.getInferenceGraphs();
  }

  @Get('inference/recommendations')
  async getSemanticRecommendations() {
    return this.inferenceService.getSemanticRecommendations();
  }

  @Get('graph')
  async getGraphData() {
    return this.graphService.getGraphData();
  }

  @Post('nodes')
  async addNode(@Body() data: any) {
    return this.graphService.addNode(data);
  }

  @Post('relations')
  async addRelation(@Body() data: any) {
    return this.graphService.addRelation(data);
  }
}
