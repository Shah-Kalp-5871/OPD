import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DomainEvent<T = any> {
  id: string;
  name: string;
  payload: T;
  timestamp: Date;
  attempt: number;
}

@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private listeners: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map();
  private dlq: DomainEvent[] = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Register a listener for a specific domain event.
   */
  subscribe<T = any>(eventName: string, listener: (event: DomainEvent<T>) => Promise<void>) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)?.push(listener);
    this.logger.log(`Subscribed async listener to event: ${eventName}`);
  }

  /**
   * Emit a domain event asynchronously.
   */
  async emit<T = any>(eventName: string, payload: T): Promise<void> {
    const event: DomainEvent<T> = {
      id: Math.random().toString(36).substring(2, 15),
      name: eventName,
      payload,
      timestamp: new Date(),
      attempt: 1,
    };

    this.logger.log(`Emitting event [${eventName}] (ID: ${event.id})`);

    // Execute listeners asynchronously
    const targetListeners = this.listeners.get(eventName) || [];
    for (const listener of targetListeners) {
      this.executeWithRetry(listener, event);
    }
  }

  /**
   * Executes a listener with retry-safe mechanisms and dead-letter queue (DLQ) support.
   */
  private async executeWithRetry(
    listener: (event: DomainEvent) => Promise<void>,
    event: DomainEvent,
  ): Promise<void> {
    const maxRetries = 3;
    let success = false;

    while (event.attempt <= maxRetries && !success) {
      try {
        await listener(event);
        success = true;
      } catch (error: any) {
        this.logger.warn(
          `Event [${event.name}] listener failed on attempt ${event.attempt}/${maxRetries} (Error: ${error.message})`,
        );
        if (event.attempt < maxRetries) {
          event.attempt++;
          // Exponential backoff delay (1s, 2s, 4s...)
          const delay = Math.pow(2, event.attempt - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          // Exceeded max retries: send to Dead-Letter Queue (DLQ)
          this.logger.error(`Event [${event.name}] failed all retries. Routing to Dead-Letter Queue (DLQ).`);
          this.addToDlq(event, error.message);
        }
      }
    }
  }

  /**
   * Adds the failed event to the Dead-Letter Queue and logs it to audit trail for HIPAA traceability.
   */
  private async addToDlq(event: DomainEvent, errorReason: string) {
    const dlqItem = {
      ...event,
      failedAt: new Date(),
      errorReason,
    };
    this.dlq.push(dlqItem);

    // Save failure trace to audit logs so superadmins can view failures in security dashboard
    try {
      await this.prisma.hipaaAuditLog.create({
        data: {
          actionType: 'EVENT_BUS_DLQ_FAIL',
          module: 'EVENT_BUS',
          timestamp: new Date(),
          details: JSON.stringify({
            eventId: event.id,
            eventName: event.name,
            attempt: event.attempt,
            errorReason,
            payload: event.payload,
          }),
        },
      });
    } catch (dbError) {
      this.logger.error('Failed to log DLQ failure to database', dbError);
    }
  }

  /**
   * Returns current items in the Dead-Letter Queue.
   */
  getDlq(): any[] {
    return this.dlq;
  }

  /**
   * Clears an item from DLQ after administrative retry.
   */
  clearDlqItem(eventId: string) {
    this.dlq = this.dlq.filter((item) => item.id !== eventId);
  }
}
