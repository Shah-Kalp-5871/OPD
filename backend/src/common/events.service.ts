import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {
  private queueEvents = new Subject<any>();

  emitQueueUpdate(data: any) {
    this.queueEvents.next({ data });
  }

  getQueueUpdates() {
    return this.queueEvents.asObservable();
  }
}
