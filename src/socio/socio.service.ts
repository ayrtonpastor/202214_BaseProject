import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';

@Injectable()
export class SocioService {
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["clubes"] });
    }

    async findOne(id: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id}, relations: ["clubes"] } );
        if (!socio)
          throw new BusinessLogicException("El socio con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);
   
        return socio;
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        if (!socio.correoElectronico.includes("@"))
          throw new BusinessLogicException("El correo electrónico del socio no tiene la @ para cumplir con el formato apropiado.", BusinessError.PRECONDITION_FAILED);

        return await this.socioRepository.save(socio);
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
        const persistedSocio: SocioEntity = await this.socioRepository.findOne({where: {id}});
        if (!persistedSocio)
          throw new BusinessLogicException("El socio con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);

        if (!socio.correoElectronico.includes("@"))
          throw new BusinessLogicException("El correo electrónico del socio no tiene la @ para cumplir con el formato apropiado.", BusinessError.PRECONDITION_FAILED);
        
        return await this.socioRepository.save({...persistedSocio, ...socio});
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id}});
        if (!socio)
          throw new BusinessLogicException("El socio con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);
     
        await this.socioRepository.remove(socio);
    }
}
