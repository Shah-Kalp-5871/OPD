import { Injectable } from '@nestjs/common';

@Injectable()
export class EdgeRoutingService {
  async getRequestHeatmap() {
    return [
      { location: 'New York, US', latitude: 40.7128, longitude: -74.0060, count: 1850, avgLatencyMs: 14 },
      { location: 'London, UK', latitude: 51.5074, longitude: -0.1278, count: 980, avgLatencyMs: 9 },
      { location: 'Mumbai, IN', latitude: 19.0760, longitude: 72.8777, count: 1420, avgLatencyMs: 18 },
      { location: 'Frankfurt, DE', latitude: 50.1109, longitude: 8.6821, count: 650, avgLatencyMs: 8 },
      { location: 'Singapore, SG', latitude: 1.3521, longitude: 103.8198, count: 870, avgLatencyMs: 22 },
    ];
  }
}