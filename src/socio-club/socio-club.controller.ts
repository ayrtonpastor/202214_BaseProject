import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { SocioDto } from 'src/socio/socio.dto';
import { SocioEntity } from 'src/socio/socio.entity';
import { SocioClubService } from './socio-club.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioClubController {
    constructor(private readonly socioClubService: SocioClubService) { }

    @Post(':clubId/members/:socioId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.socioClubService.addMemberToClub(clubId, socioId);
    }

    @Get(':clubId/members/:socioId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.socioClubService.findMemberFromClub(clubId, socioId);
    }

    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string) {
        return await this.socioClubService.findMembersFromClub(clubId);
    }

    @Put(':clubId/members')
    async associateArtworksMuseum(@Body() sociosDto: SocioDto[], @Param('clubId') clubId: string) {
        const socios = plainToInstance(SocioEntity, sociosDto)
        return await this.socioClubService.updateMembersFromClub(clubId, socios);
    }

    @Delete(':clubId/members/:socioId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.socioClubService.deleteMemberFromClub(clubId, socioId);
    }
}
