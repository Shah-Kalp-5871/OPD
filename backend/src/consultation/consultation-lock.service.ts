import { Injectable } from '@nestjs/common';
import { EventsService } from '../common/events.service';
import { Role } from '@prisma/client';

export interface LockEntry {
  userId: string;
  role: Role;
  lockedAt: number;
}

const ROLE_PRIORITY: Partial<Record<Role, number>> = {
  [Role.DOCTOR]: 1,
  [Role.ADMIN]: 1,
  [Role.RECEPTION]: 2,
  [Role.NURSING]: 3,
  [Role.MEDICAL]: 4,
};

@Injectable()
export class ConsultationLockService {
  // Map of caseId -> LockEntry
  private locks = new Map<string, LockEntry>();

  constructor(private events: EventsService) {}

  acquireLock(caseId: string, userId: string, role: Role): { success: boolean; currentLock?: LockEntry } {
    const currentLock = this.locks.get(caseId);

    // If no lock, acquire it
    if (!currentLock) {
      this.setLock(caseId, userId, role);
      return { success: true };
    }

    // If locked by the same user, refresh it
    if (currentLock.userId === userId) {
      this.setLock(caseId, userId, role);
      return { success: true };
    }

    // Compare priorities
    const currentPriority = ROLE_PRIORITY[currentLock.role] || 99;
    const newPriority = ROLE_PRIORITY[role] || 99;

    // Lower number is higher priority (e.g., Doctor=1, Nursing=3)
    // If the priorities are the same, the first one keeps the lock, UNLESS we decide otherwise. Let's allow equal priority to override or maybe not?
    // Doctor > Receptionist > Nursing.
    if (newPriority < currentPriority) {
      // Force steal the lock
      this.setLock(caseId, userId, role);
      
      // Emit an event so the previous user gets kicked
      this.events.emitQueueUpdate({
        type: 'CASE_LOCKED',
        caseId,
        lockedByUserId: userId,
        lockedByRole: role,
      });

      return { success: true };
    }

    // Cannot acquire lock
    return { success: false, currentLock };
  }

  releaseLock(caseId: string, userId: string) {
    const currentLock = this.locks.get(caseId);
    if (currentLock && currentLock.userId === userId) {
      this.locks.delete(caseId);
      this.events.emitQueueUpdate({
        type: 'CASE_UNLOCKED',
        caseId,
      });
    }
  }

  getLock(caseId: string) {
    return this.locks.get(caseId);
  }

  private setLock(caseId: string, userId: string, role: Role) {
    this.locks.set(caseId, {
      userId,
      role,
      lockedAt: Date.now(),
    });
  }
}
