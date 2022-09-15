import { Test, TestingModule } from '@nestjs/testing';
import { ClubEntity } from '../club/club.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { SocioClubService } from './socio-club.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();

    club = await clubRepository.save({
      nombre: faker.name.jobArea(),
      fechaFundacion: faker.date.recent(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.paragraphs(),
      socios: []
    })

    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const receta: SocioEntity = await socioRepository.save({
        nombre: faker.name.firstName(),
        correoElectronico: faker.internet.email(),
        fechaNacimiento: faker.date.recent(),
        clubes: []
      })
      sociosList.push(receta);
    }

    for (let i = 0; i < 5; i++) {
      await service.addMemberToClub(club.id, sociosList[i].id);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub debe agregar un socio a un club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.firstName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent(),
      clubes: []
    });

    const result: ClubEntity = await service.addMemberToClub(club.id, newSocio.id);

    expect(result.socios.length).toBe(6);
    expect(result.socios[5]).not.toBeNull();
    expect(result.socios[5].nombre).toBe(newSocio.nombre);
    expect(result.socios[5].correoElectronico).toBe(newSocio.correoElectronico);
  });

  it('addMemberToClub debe lanzar error debido a una socio inexistente', async () => {
    await expect(() => service.addMemberToClub(club.id, "0")).rejects.toHaveProperty("message", "El socio con el id brindado no ha sido encontrado.");
  });

  it('addMemberToClub debe lanzar error debido a un club inexistente', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.firstName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent(),
      clubes: []
    });

    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "El club con el id brindado no ha sido encontrado.");
  });

  it('findMemberFromClub debe retornar un socio por id de un club por el id dado', async () => {
    const storedSocio: SocioEntity = await service.findMemberFromClub(club.id, sociosList[0].id)
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toBe(sociosList[0].nombre);
    expect(storedSocio.correoElectronico).toBe(sociosList[0].correoElectronico);
  });

  it('findMemberFromClub debe arrojar error debido a un socio inexistente', async () => {
    await expect(() => service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "El socio con el id brindado no ha sido encontrado.");
  });

  it('findMemberFromClub debe arrojar error debido a un club inexistente', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.findMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "El club con el id brindado no ha sido encontrado.");
  });

  it('findMemberFromClub debe arrojar error debido a que el socio no pertenece al club', async () => {
    const otherClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.jobArea(),
      fechaFundacion: faker.date.recent(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.paragraphs(),
      socios: []
    });

    await expect(() => service.findMemberFromClub(otherClub.id, sociosList[0].id)).rejects.toHaveProperty("message", "El socio con el id dado no está asociado al club con el id brindado.");
  });

  it('findMembersFromClub debe retornar los socios del club', async () => {
    const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(5)
  });

  it('findMembersFromClub debe arrojar error debido a un club inexistente', async () => {
    await expect(() => service.findMembersFromClub("0")).rejects.toHaveProperty("message", "El club con el id brindado no ha sido encontrado.");
  });

  it('updateMembersFromClub debe actualizar la lista de socios del club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.firstName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent(),
      clubes: []
    });

    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);

    expect(updatedClub.socios[0].nombre).toBe(newSocio.nombre);
    expect(updatedClub.socios[0].correoElectronico).toBe(newSocio.correoElectronico);
  });

  it('updateMembersFromClub debe arrojar un error debido a un club inexistente', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.firstName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent(),
      clubes: []
    });

    await expect(() => service.updateMembersFromClub("0", [newSocio])).rejects.toHaveProperty("message", "El club con el id brindado no ha sido encontrado.");
  });

  it('updateMembersFromClub debe arrojar un error debido a un socio inexistente', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = "0";

    await expect(() => service.updateMembersFromClub(club.id, [newSocio])).rejects.toHaveProperty("message", "El socio con el id brindado no ha sido encontrado.");
  });

  it('deleteMemberFromClub debe eliminar el socio de un club', async () => {
    const socio: SocioEntity = sociosList[0];

    await service.deleteMemberFromClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({ where: { id: club.id }, relations: ["socios"] });
    const deletedSocio: SocioEntity = storedClub.socios.find(a => a.id === socio.id);

    expect(deletedSocio).toBeUndefined();
  });

  it('deleteMemberFromClub debe arrojar error debido a un socio inexistente', async () => {
    await expect(() => service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "El socio con el id brindado no ha sido encontrado.");
  });

  it('deleteMemberFromClub debe arrojar error debido a un club inexistente', async () => {
    const receta: SocioEntity = sociosList[0];
    await expect(() => service.deleteMemberFromClub("0", receta.id)).rejects.toHaveProperty("message", "El club con el id brindado no ha sido encontrado.");
  });

  it('deleteMemberFromClub debe arrojar error debido a que el socio no pertenece al club', async () => {
    const otherClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.jobArea(),
      fechaFundacion: faker.date.recent(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.paragraphs(),
      socios: []
    });

    await expect(() => service.deleteMemberFromClub(otherClub.id, sociosList[0].id)).rejects.toHaveProperty("message", "El socio con el id dado no está asociado al club con el id brindado.");
  });
});

