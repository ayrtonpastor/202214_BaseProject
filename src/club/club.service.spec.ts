import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        nombre: faker.name.jobArea(),
        fechaFundacion: faker.date.recent(),
        imagen: faker.image.imageUrl(),
        descripcion: faker.lorem.sentences().substring(0, 99),
        socios: []
      });
      clubsList.push(club);
    }
  }

  it('findAll debe retornar todos los clubes', async () => {
    const clubes: ClubEntity[] =
      await service.findAll();
    expect(clubes).not.toBeNull();
    expect(clubes).toHaveLength(clubsList.length);
  });

  it('findOne debe retornar un club por su id', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const club: ClubEntity =
      await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(
      storedClub.nombre,
    );
    expect(club.descripcion).toEqual(
      storedClub.descripcion,
    );
  });

  it('findOne debe arrojar una excepción debido a un club inexistente', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El club con el id brindado no ha sido encontrado.',
    );
  });

  it('create debería crear un club', async () => {
    const club: ClubEntity = {
      id: '',
      nombre: faker.name.jobArea(),
      fechaFundacion: faker.date.recent(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentences().substring(0, 99),
      socios: []
    };

    const newClub: ClubEntity =
      await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity =
      await repository.findOne({
        where: { id: `${newClub.id}` },
      });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(
      newClub.nombre,
    );
    expect(storedClub.descripcion).toEqual(
      newClub.descripcion,
    );
  });

  it('create debe arrojar error al crear un club con una descripción de más de 100 caracteres', async () => {
    const club: ClubEntity = {
      id: '',
      nombre: faker.name.jobArea(),
      fechaFundacion: faker.date.recent(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.paragraphs(),
      socios: []
    };

    await expect(() =>
      service.create(club),
    ).rejects.toHaveProperty(
      'message',
      'La descripción del club no puede tener más de 100 caracteres.',
    );
  });

  it('update debe actualizar un club', async () => {
    const club: ClubEntity =
      clubsList[3];
    club.nombre = 'New name';
    club.descripcion = 'New description';
    const updatedClub: ClubEntity =
      await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
    const storedClub: ClubEntity =
      await repository.findOne({ where: { id: `${club.id}` } });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(
      club.nombre,
    );
    expect(storedClub.descripcion).toEqual(
      club.descripcion,
    );
  });

  it('update debe arrojar error debido a un club inexistente', async () => {
    let club: ClubEntity =
      clubsList[4];
    club = {
      ...club,
      nombre: 'New name',
      descripcion: 'New description',
    };
    await expect(() =>
      service.update('0', club),
    ).rejects.toHaveProperty(
      'message',
      'El club con el id brindado no ha sido encontrado.',
    );
  });

  it('update debe arrojar error debido a la descripción de club con más de 100 caracteres', async () => {
    let club: ClubEntity =
      clubsList[4];
    club = {
      ...club,
      nombre: 'New name',
      descripcion: faker.lorem.paragraphs(),
    };

    await expect(() =>
      service.update(club.id, club),
    ).rejects.toHaveProperty(
      'message',
      'La descripción del club no puede tener más de 100 caracteres.',
    );
  });

  it('delete debe eliminar un club', async () => {
    const club: ClubEntity =
      clubsList[2];
    await service.delete(club.id);
    const deletedClub: ClubEntity =
      await repository.findOne({ where: { id: `${club.id}` } });
    expect(deletedClub).toBeNull();
  });

  it('delete debe arrojar un error debido a un club inexistente', async () => {
    const club: ClubEntity =
      clubsList[0];
    await service.delete(club.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El club con el id brindado no ha sido encontrado.',
    );
  });
});
