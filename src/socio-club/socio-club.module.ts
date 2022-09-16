import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from 'src/club/club.entity';
import { SocioEntity } from 'src/socio/socio.entity';
import { SocioClubService } from './socio-club.service';
import { SocioClubController } from './socio-club.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity, SocioEntity])],
  providers: [SocioClubService],
  controllers: [SocioClubController]
})
export class SocioClubModule {}
