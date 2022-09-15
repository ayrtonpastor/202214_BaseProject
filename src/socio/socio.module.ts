import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity])],
  providers: [SocioService]
})
export class SocioModule {}
