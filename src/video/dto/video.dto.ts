
import { User, Video } from '@/entities';
import { PickType } from '@nestjs/swagger';

export class videoUploadDto extends PickType(Video, [
  'title',
  'description',
]) {}
export class createUserDto extends PickType(User, ['email']) {}