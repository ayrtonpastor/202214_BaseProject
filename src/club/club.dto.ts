import { IsNotEmpty, IsString } from "class-validator";

export class ClubDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly fechaFundacion: string;

    @IsString()
    @IsNotEmpty()
    readonly imagen: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
}
