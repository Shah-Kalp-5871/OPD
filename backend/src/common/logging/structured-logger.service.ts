import { Injectable, LoggerService, ConsoleLogger } from '@nestjs/common';
import { loggingStore } from './logging.context';

@Injectable()
export class StructuredLogger extends ConsoleLogger implements LoggerService {
  
  private formatLog(severity: string, message: any, context?: string, trace?: string) {
    const store = loggingStore.getStore();
    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp,
      severity,
      module: context || 'Application',
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      requestId: store?.correlationId || 'system-bootstrap',
      userId: store?.userId || 'anonymous',
      branchId: store?.branchId || 'system-global',
      ...(trace ? { trace } : {})
    };

    // Print raw JSON to stdout so Promtail/Loki picks it up natively
    console.log(JSON.stringify(logEntry));
  }

  log(message: any, context?: string) {
    this.formatLog('info', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.formatLog('error', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.formatLog('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.formatLog('debug', message, context);
  }

  verbose(message: any, context?: string) {
    this.formatLog('verbose', message, context);
  }
}
