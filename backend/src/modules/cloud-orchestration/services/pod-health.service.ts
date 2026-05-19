import { Injectable } from '@nestjs/common';

@Injectable()
export class PodHealthService {
  async getPodGridStatus() {
    return [
      { podId: 'medflow-api-5dff6-9bc1a', namespace: 'production-core', status: 'RUNNING', restarts: 0, age: '14d', ready: '1/1' },
      { podId: 'medflow-api-5dff6-b21a8', namespace: 'production-core', status: 'RUNNING', restarts: 1, age: '14d', ready: '1/1' },
      { podId: 'medflow-web-6ff31-z7c28', namespace: 'production-web', status: 'RUNNING', restarts: 0, age: '22d', ready: '1/1' },
      { podId: 'biomedical-adapter-91a3c', namespace: 'production-iot', status: 'RUNNING', restarts: 0, age: '5d', ready: '1/1' },
      { podId: 'analytics-aggregator-0aa91', namespace: 'production-analytics', status: 'RUNNING', restarts: 4, age: '2d', ready: '1/1' },
    ];
  }
}