import { ClubEntity } from '../club/club.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocioEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 correoElectronico: string;
 
 @Column()
 fechaNacimiento: Date;

 @ManyToMany(() => ClubEntity, (club) => club.socios)
 @JoinTable()
  clubes: ClubEntity[];
}