import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity])],
  providers: [ClubService]
})
export class ClubModule {}
