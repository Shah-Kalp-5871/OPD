import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { loggingStore } from './logging.context';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
    res.setHeader('x-correlation-id', correlationId);

    // Dynamic extraction of authenticated user/branch details from JWT/headers (if present)
    const userId = req.headers['x-user-id'] as string || undefined;
    const branchId = req.headers['x-branch-id'] as string || undefined;

    loggingStore.run({ correlationId, userId, branchId }, () => {
      next();
    });
  }
}
