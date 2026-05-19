import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceMeshService {
  async getMeshSecurityStatus() {
    return {
      mtlsEnforced: true,
      mtlsMode: 'STRICT',
      activePolicies: [
        { name: 'global-deny-all', scope: 'NAMESPACE', status: 'ACTIVE' },
        { name: 'clinical-mesh-authorization', scope: 'SERVICE', status: 'ACTIVE' },
        { name: 'gateway-rate-limiter', scope: 'INGRESS', status: 'ACTIVE' },
      ],
      eastWestEncryptedRatio: 1.0,
      certificatesIssued: 42,
      lastRotationAt: new Date(),
    };
  }
}