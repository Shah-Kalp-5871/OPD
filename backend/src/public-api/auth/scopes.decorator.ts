import { SetMetadata } from '@nestjs/common';

export const Scopes = (...scopes: string[]) => SetMetadata('requiredScopes', scopes);
