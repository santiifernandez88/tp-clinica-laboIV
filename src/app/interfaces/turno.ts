import { HistoriaClinica } from "./historiaClinica";
import { Horario } from "./jornada";

export interface Turno {
    horario: Horario,
    fecha: string,
    pacienteEmail: string,
    especialistaEmail: string,
    especialidad: string,
    estado: string,
    id: string,
    reseña: string,
    calificacion: number,
    encuesta: string[],
    historial: HistoriaClinica | null,
}

export interface DiaAtencion {
    fecha: string,
    dia: string,
    horarios: HorarioAtencion[];
}

export interface HorarioAtencion {
    horario: Horario;
    especialistaEmail: string,
    disponible: boolean,
}