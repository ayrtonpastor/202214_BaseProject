import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        nombre: faker.name.firstName(),
        correoElectronico: faker.internet.email(),
        fechaNacimiento: faker.date.recent(),
        clubes: []
      });
      sociosList.push(socio);
    }
  }

  it('findAll debe retornar todos los socios', async () => {
    const socios: SocioEntity[] =
      await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('findOne debe retornar un socio por su id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity =
      await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.nombre).toEqual(
      storedSocio.nombre,
    );
    expect(socio.correoElectronico).toEqual(
      storedSocio.correoElectronico,
    );
  });

  it('findOne debe arrojar una excepción debido a un socio inexistente', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El socio con el id brindado no ha sido encontrado.',
    );
  });

  it('create debería crear un socio', async () => {
    const socio: SocioEntity = {
      id: '',
      nombre: faker.name.firstName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent(),
      clubes: []
    };

    const newSocio: SocioEntity =
      await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity =
      await repository.findOne({
        where: { id: `${newSocio.id}` },
      });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(
      newSocio.nombre,
    );
    expect(storedSocio.correoElectronico).toEqual(
      newSocio.correoElectronico,
    );
  });

  it('create debe arrojar error al crear un socio con una correo electrónico sin @', async () => {
    const socio: SocioEntity = {
      id: '',
      nombre: faker.name.firstName(),
      correoElectronico: "correo_sin_arroba",
      fechaNacimiento: faker.date.recent(),
      clubes: []
    };

    await expect(() =>
      service.create(socio),
    ).rejects.toHaveProperty(
      'message',
      'El correo electrónico del socio no tiene la @ para cumplir con el formato apropiado.',
    );
  });

  it('update debe actualizar un socio', async () => {
    const socio: SocioEntity =
      sociosList[3];
    socio.nombre = 'New name';
    socio.correoElectronico = 'ayrton@hola.com';
    const updatedSocio: SocioEntity =
      await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();
    const storedSocio: SocioEntity =
      await repository.findOne({ where: { id: `${socio.id}` } });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(
      socio.nombre,
    );
    expect(storedSocio.correoElectronico).toEqual(
      socio.correoElectronico,
    );
  });

  it('update debe arrojar error debido a un socio inexistente', async () => {
    let socio: SocioEntity =
      sociosList[4];
      socio = {
      ...socio,
      nombre: 'New name',
      correoElectronico: 'ayrton@hola.com',
    };
    await expect(() =>
      service.update('0', socio),
    ).rejects.toHaveProperty(
      'message',
      'El socio con el id brindado no ha sido encontrado.',
    );
  });

  it('update debe arrojar error debido a que el correo electrónico del socio no tiene @', async () => {
    let socio: SocioEntity =
      sociosList[4];
      socio = {
      ...socio,
      nombre: 'New name',
      correoElectronico: "correo_sin_arroba",
    };

    await expect(() =>
      service.update(socio.id, socio),
    ).rejects.toHaveProperty(
      'message',
      'El correo electrónico del socio no tiene la @ para cumplir con el formato apropiado.',
    );
  });

  it('delete debe eliminar un socio', async () => {
    const socio: SocioEntity =
      sociosList[2];
    await service.delete(socio.id);
    const deletedSocio: SocioEntity =
      await repository.findOne({ where: { id: `${socio.id}` } });
    expect(deletedSocio).toBeNull();
  });

  it('delete debe arrojar un error debido a un socio inexistente', async () => {
    const socio: SocioEntity =
      sociosList[0];
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El socio con el id brindado no ha sido encontrado.',
    );
  });
});
