import { Controller, Sse, MessageEvent, UseGuards, Post } from '@nestjs/common';
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

  @Post('test-bell')
  triggerTestBell() {
    this.eventsService.emitQueueUpdate({
      type: 'SESSION_ENDED',
      id: 'test-bell-123',
      status: 'COMPLETED',
      token: 'TEST-001',
      patientName: 'Demo Patient',
      nextStage: 'RECEPTION',
    });
    return { success: true, message: 'Test bell triggered' };
  }
}
