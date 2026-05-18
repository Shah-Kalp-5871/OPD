# MedFlow TypeScript SDK

```bash
npm install @medflow/sdk
```

```typescript
import { MedFlowClient } from '@medflow/sdk';

const client = new MedFlowClient({ apiKey: process.env.MEDFLOW_API_KEY! });
const patients = await client.patients.list({ limit: 20 });
```

Scaffold — implement against OpenAPI spec in `docs/developer/openapi.yaml`.
