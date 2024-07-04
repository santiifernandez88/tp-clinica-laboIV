export interface HistoriaClinica{
    altura : string,
    peso : string,
    temperatura : string,
    presion : string,
    datos: DatoDinamico[]

}

export interface DatoDinamico {
    [clave: string]: string
}
