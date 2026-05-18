import { Injectable, Logger } from '@nestjs/common';
import { RedisRoomRepository } from './redis-room.repository';

export interface RoomParticipant {
  userId: string;
  role: string;
  socketId: string;
  joinedAt: string;
}

@Injectable()
export class RoomStateService {
  private readonly logger = new Logger(RoomStateService.name);
  private readonly ttlSeconds = 4 * 60 * 60; // 4 hours TTL for auto-cleanup of idle rooms

  constructor(private readonly redisRepo: RedisRoomRepository) {}

  private getParticipantsKey(roomId: string): string {
    return `telemedicine:room:${roomId}:participants`;
  }

  private getMetadataKey(roomId: string): string {
    return `telemedicine:room:${roomId}:meta`;
  }

  private getSocketMappingKey(): string {
    return 'telemedicine:socket-mappings';
  }

  /**
   * Registers socket connection metadata for cleanup on disconnect.
   */
  async registerSocket(socketId: string, roomId: string, userId: string): Promise<void> {
    const key = this.getSocketMappingKey();
    const client = this.redisRepo.getClient();

    await client.hset(key, socketId, JSON.stringify({ roomId, userId }));
    await client.expire(key, this.ttlSeconds);
  }

  /**
   * Retrieves registered socket connection metadata.
   */
  async getSocketMapping(socketId: string): Promise<{ roomId: string; userId: string } | null> {
    const key = this.getSocketMappingKey();
    const client = this.redisRepo.getClient();

    const data = await client.hget(key, socketId);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Deregisters socket connection metadata.
   */
  async deregisterSocket(socketId: string): Promise<void> {
    const key = this.getSocketMappingKey();
    const client = this.redisRepo.getClient();

    await client.hdel(key, socketId);
  }


  /**
   * Adds or updates a participant in the room.
   */
  async addParticipant(
    roomId: string,
    userId: string,
    role: string,
    socketId: string,
  ): Promise<void> {
    const key = this.getParticipantsKey(roomId);
    const client = this.redisRepo.getClient();

    const participant: RoomParticipant = {
      userId,
      role,
      socketId,
      joinedAt: new Date().toISOString(),
    };

    const pipeline = client.pipeline();
    pipeline.hset(key, userId, JSON.stringify(participant));
    pipeline.expire(key, this.ttlSeconds);

    await pipeline.exec();
    this.logger.log(`Redis state: Added participant ${userId} (${role}) to room ${roomId}`);
  }

  /**
   * Removes a participant from the room.
   */
  async removeParticipant(roomId: string, userId: string): Promise<void> {
    const key = this.getParticipantsKey(roomId);
    const client = this.redisRepo.getClient();

    await client.hdel(key, userId);
    this.logger.log(`Redis state: Removed participant ${userId} from room ${roomId}`);
  }

  /**
   * Gets all active participants in a room.
   */
  async getParticipants(roomId: string): Promise<RoomParticipant[]> {
    const key = this.getParticipantsKey(roomId);
    const client = this.redisRepo.getClient();

    const data = await client.hgetall(key);
    if (!data || Object.keys(data).length === 0) {
      return [];
    }

    const participants: RoomParticipant[] = [];
    for (const userId of Object.keys(data)) {
      try {
        const participant = JSON.parse(data[userId]) as RoomParticipant;
        participants.push(participant);
      } catch (err) {
        this.logger.error(`Error parsing participant data for user ${userId} in room ${roomId}`, (err as Error).stack);
      }
    }

    return participants;
  }

  /**
   * Updates metadata for the room.
   */
  async setRoomMetadata(roomId: string, meta: Record<string, any>): Promise<void> {
    const key = this.getMetadataKey(roomId);
    const client = this.redisRepo.getClient();

    const pipeline = client.pipeline();
    pipeline.set(key, JSON.stringify(meta));
    pipeline.expire(key, this.ttlSeconds);

    await pipeline.exec();
    this.logger.log(`Redis state: Set metadata for room ${roomId}`);
  }

  /**
   * Retrieves metadata for the room.
   */
  async getRoomMetadata(roomId: string): Promise<Record<string, any> | null> {
    const key = this.getMetadataKey(roomId);
    const client = this.redisRepo.getClient();

    const data = await client.get(key);
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (err) {
      this.logger.error(`Error parsing metadata for room ${roomId}`, (err as Error).stack);
      return null;
    }
  }

  /**
   * Clears all room state from Redis.
   */
  async clearRoom(roomId: string): Promise<void> {
    const client = this.redisRepo.getClient();
    const pipeline = client.pipeline();
    pipeline.del(this.getParticipantsKey(roomId));
    pipeline.del(this.getMetadataKey(roomId));

    await pipeline.exec();
    this.logger.log(`Redis state: Cleared all state for room ${roomId}`);
  }
}
