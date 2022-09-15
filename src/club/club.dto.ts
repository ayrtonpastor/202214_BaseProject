import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class ClubDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsDate()
    @IsNotEmpty()
    readonly fechaFundacion: Date;

    @IsString()
    @IsNotEmpty()
    readonly imagen: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
}
