import { IsString, IsNotEmpty } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class GenerateTokenDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}
