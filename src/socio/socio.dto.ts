import { IsNotEmpty, IsString } from "class-validator";

export class SocioDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly correoElectronico: string;

    @IsString()
    @IsNotEmpty()
    readonly fechaNacimiento: Date;
}
