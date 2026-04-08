import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JAMMIT_ENTITIES } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature(JAMMIT_ENTITIES)],
  exports: [TypeOrmModule],
})
export class JammitPersistenceModule {}
