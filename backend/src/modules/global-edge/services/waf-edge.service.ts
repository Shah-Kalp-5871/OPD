import { Injectable } from '@nestjs/common';

@Injectable()
export class WafEdgeService {
  async getWafEvents() {
    return [
      { timestamp: new Date(), ipAddress: '198.51.100.42', country: 'RU', action: 'BLOCKED', ruleTriggered: 'SQL Injection signature detected in search payload' },
      { timestamp: new Date(), ipAddress: '203.0.113.88', country: 'CN', action: 'CHALLENGED', ruleTriggered: 'Rate limit threshold breached (HTTP requests/min)' },
      { timestamp: new Date(), ipAddress: '185.230.124.9', country: 'NL', action: 'BLOCKED', ruleTriggered: 'Known malicious TOR gateway scraper lookup attempt' },
    ];
  }
}