import { Especialidades } from "./especialidades";

export interface Especialista{
    nombre: string,
    apellido: string,
    edad: number, 
    dni: number,
    especialidades: string [],
    mail: string,
    password: string,
    fotoPerfil: string,
    habilitado: boolean
}