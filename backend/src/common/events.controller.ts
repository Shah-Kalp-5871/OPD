import { Controller, Sse, MessageEvent, UseGuards } from '@nestjs/common';
import { EventsService } from '../common/events.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse('queue')
  streamQueueUpdates(): Observable<MessageEvent> {
    return this.eventsService.getQueueUpdates().pipe(
      map((event) => ({
        data: event.data,
      })),
    );
  }

  @Sse('clinical')
  streamClinicalUpdates(): Observable<MessageEvent> {
    return this.eventsService.getClinicalUpdates().pipe(
      map((event) => ({
        data: event.data,
      })),
    );
  }
}
