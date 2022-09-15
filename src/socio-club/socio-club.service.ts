import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioClubService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,

        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ) { }

    async addMemberToClub(idClub: string, idSocio: string): Promise<ClubEntity> {
        const club = await this.clubRepository.findOne({ where: { id: `${idClub}` }, relations: ['socios'] });
        if (!club)
            throw new BusinessLogicException("El club con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);

        const socio = await this.socioRepository.findOne({ where: { id: `${idSocio}` } });
        if (!socio)
            throw new BusinessLogicException("El socio con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);

        club.socios = [...club.socios, socio];

        return await this.clubRepository.save(club);
    }

    async findMemberFromClub(idClub: string, idSocio: string): Promise<SocioEntity> {
        const club = await this.clubRepository.findOne({ where: { id: `${idClub}` }, relations: ['socios'] });
        if (!club)
            throw new BusinessLogicException("El club con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);

        const socio = await this.socioRepository.findOne({ where: { id: `${idSocio}` } });
        if (!socio)
            throw new BusinessLogicException("El socio con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);

        const socioClub: SocioEntity = club.socios.find((socio) => socio.id === idSocio);
        if (!socioClub) {
            throw new BusinessLogicException('El socio con el id dado no está asociado al club con el id brindado.', BusinessError.PRECONDITION_FAILED);
        }

        return socioClub;
    }

    async findMembersFromClub(idClub: string): Promise<SocioEntity[]> {
        const club = await this.clubRepository.findOne({ where: { id: `${idClub}` }, relations: ['socios'] });
        if (!club)
            throw new BusinessLogicException("El club con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);

        return club.socios;
    }

    async updateMembersFromClub(idClub: string, socios: SocioEntity[]): Promise<ClubEntity> {
        const club = await this.clubRepository.findOne({ where: { id: `${idClub}` }, relations: ['socios'] });
        if (!club)
            throw new BusinessLogicException("El club con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);

        for (let i = 0; i < socios.length; i++) {
            const socio: SocioEntity = await this.socioRepository.findOne({ where: { id: socios[i].id } });
            if (!socio)
                throw new BusinessLogicException("El socio con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND)
        }

        club.socios = socios;
        return await this.clubRepository.save(club);
    }

    async deleteMemberFromClub(idClub: string, idSocio: string) {
        const club = await this.clubRepository.findOne({ where: { id: `${idClub}` }, relations: ['socios'] });
        if (!club)
            throw new BusinessLogicException("El club con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);

        const socio = await this.socioRepository.findOne({ where: { id: `${idSocio}` } });
        if (!socio)
            throw new BusinessLogicException("El socio con el id brindado no ha sido encontrado.", BusinessError.NOT_FOUND);

        const socioClub: SocioEntity = club.socios.find((socio) => socio.id === idSocio);
        if (!socioClub){
            throw new BusinessLogicException('El socio con el id dado no está asociado al club con el id brindado.', BusinessError.PRECONDITION_FAILED);
        }

        club.socios = club.socios.filter(e => e.id !== idSocio);
        await this.clubRepository.save(club);
    }
}
