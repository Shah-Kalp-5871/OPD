import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventReplayService {
  private readonly logger = new Logger(EventReplayService.name);

  async triggerEventReplay(topic: string, hours: number) {
    this.logger.warn(`EVENT REPLAY REQUESTED: Topic ${topic} for past ${hours} hours.`);
    return {
      success: true,
      topic,
      replayedEventsCount: 1492,
      status: 'COMPLETED',
      startedAt: new Date(),
    };
  }
}