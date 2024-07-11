export interface HistoriaClinica{
    altura: string,
    peso: string,
    temperatura: string,
    presion: string,
    datos: DatoDinamico[],
    especialsitaEmail: string,
    pacienteEmail: string,
}

export interface DatoDinamico {
    [clave: string]: string
}
