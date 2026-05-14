import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { EventsService } from '../common/events.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse('queue')
  streamQueueUpdates(): Observable<MessageEvent> {
    return this.eventsService.getQueueUpdates().pipe(
      map((event) => ({
        data: event.data,
      } as MessageEvent)),
    );
  }
}
