import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelemedicineGateway } from './telemedicine.gateway';
import { TelemedicineService } from './telemedicine.service';
import { TelemedicineController } from './telemedicine.controller';
import { WsAuthModule } from './auth/ws-auth.module';
import { RedisRoomRepository } from './redis/redis-room.repository';
import { RoomStateService } from './redis/room-state.service';
import { TelemedicineAuthorizationService } from './services/telemedicine-authorization.service';

@Module({
  imports: [WsAuthModule, ConfigModule],
  providers: [
    TelemedicineGateway,
    TelemedicineService,
    RedisRoomRepository,
    RoomStateService,
    TelemedicineAuthorizationService,
  ],
  controllers: [TelemedicineController],
  exports: [TelemedicineService, RoomStateService, TelemedicineAuthorizationService],
})
export class TelemedicineModule {}

