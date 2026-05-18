import { Controller, Get } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

@Controller('api/v2/docs')
export class PublicApiDocsController {
  @Get('openapi')
  getOpenApiSpec() {
    const candidates = [
      join(process.cwd(), 'docs', 'developer', 'openapi.yaml'),
      join(process.cwd(), '..', 'docs', 'developer', 'openapi.yaml'),
    ];
    const path = candidates.find((p) => existsSync(p));
    if (!path) {
      return { openapi: '3.0.3', info: { title: 'MedFlow Public API', version: '2.0.0' }, paths: {} };
    }
    const raw = readFileSync(path, 'utf8');
    return { format: 'yaml', spec: raw };
  }

  @Get('onboarding')
  getOnboarding() {
    return {
      steps: [
        'Register an API client via admin portal or POST /api/v2/oauth/register',
        'Store your API key securely (shown once)',
        'Send X-Api-Key header on all requests',
        'Subscribe to webhooks for real-time events',
        'Monitor usage at /developer/usage',
      ],
      authentication: {
        apiKey: 'X-Api-Key: mf_live_... or Authorization: ApiKey mf_live_...',
        oauth: 'Authorization: Bearer <access_token>',
      },
      rateLimits: {
        sandbox: '100 requests/minute',
        production: 'Configurable per client (default 1000/min)',
      },
    };
  }
}
