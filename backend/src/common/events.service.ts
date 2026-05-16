import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {
  private queueEvents = new Subject<any>();
  private clinicalEvents = new Subject<any>();
  private caseEvents = new Subject<any>();

  emitQueueUpdate(data: any) {
    this.queueEvents.next({ data });
  }

  getQueueUpdates() {
    return this.queueEvents.asObservable();
  }

  emitClinicalUpdate(data: any) {
    this.clinicalEvents.next({ data });
  }

  getClinicalUpdates() {
    return this.clinicalEvents.asObservable();
  }

  emitBillingUpdate(data: any) {
    this.caseEvents.next({ data }); // Using caseEvents for billing/financial updates
  }

  getBillingUpdates() {
    return this.caseEvents.asObservable();
  }
}
