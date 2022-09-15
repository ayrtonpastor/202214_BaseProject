import { ClubEntity } from '../club/club.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocioEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 correoElectrónico: string;
 
 @Column()
 fechaNacimiento: string;

 @ManyToMany(() => ClubEntity, (club) => club.socios)
 @JoinTable()
  clubes: ClubEntity[];
}