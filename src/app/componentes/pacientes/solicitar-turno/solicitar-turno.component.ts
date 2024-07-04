import { Component } from '@angular/core';
import { Horario, Jornada } from '../../../interfaces/jornada';
import { HorarioAtencion, Turno } from '../../../interfaces/turno';
import { Especialista } from '../../../interfaces/especialista';
import { JornadaService } from '../../../services/jornada.service';
import { AuthService } from '../../../services/auth.service';
import { EspecialistaService } from '../../../services/especialista.service';
import { EspecialidadesService } from '../../../services/especialidades.service';
import { TurnoService } from '../../../services/turno.service';
import { CommonModule } from '@angular/common';
import { HoraFormatPipe } from "../../../pipes/hora-format.pipe";

@Component({
    selector: 'app-solicitar-turno',
    standalone: true,
    templateUrl: './solicitar-turno.component.html',
    styleUrl: './solicitar-turno.component.css',
    imports: [CommonModule, HoraFormatPipe]
})
export class SolicitarTurnoComponent {

  public jornadas!: Jornada[];
  public fechas!: any;
  public turnosDisponibles: any[] | null = null;
  public turno!: Turno;
  public horarios: Horario[] = [];
  public pacienteEmail!: string;
  public turnosActuales!: Turno[];
  public especialistas: Especialista[] = [];
  public especialistasDisponibles: Especialista[] = [];
  public especialidades: Especialista[] = [];
  public filtroSelect: string = "";
  public especialidadSelect: string = "";
  public especialistaSelect: Especialista | null = null;
  public diaSelect: HorarioAtencion | null = null;
  public indexDiaSelect: number = 0;
  public diaNombreSelect: string = '';


  constructor(private jor: JornadaService, private tur: TurnoService, private auth: AuthService, private esp: EspecialistaService, private especial: EspecialidadesService) { }

  ngOnInit(): void {
    // this.auth.getUserLogged().subscribe(user => this.pacienteEmail = user?.email!);
    // this.esp.traer().subscribe(data => this.especialistas = data);
    // this.especial.traer().subscribe(data => this.especialidades = data);
    // this.jor.traerJornadas().subscribe(res => {
    //   this.jornadas = res
    //   this.tur.traerTurnos().subscribe(data => this.turnosActuales = data);
    // });
  }


  getEspecialista(email: string): string {
    let nombre = '';
    for (const esp of this.especialistas) {
      if (esp.mail === email) {
        nombre = `${esp.nombre} ${esp.apellido}`;
        break;
      }
    }
    return nombre;
  }

  cargarTurnos(): void {
    this.horarios = [];
    this.turnosDisponibles = [];
    let fecha = new Date(Date.now());
    fecha.setDate(fecha.getDate() + 1);

    for (let index = 0; index < 15; index++) {
      let unDia: HorarioAtencion[] = [];
      if (index != 0)
        fecha.setDate(fecha.getDate() + 1);

      const dia = this.convertirDiaATexto(fecha.getDay());
      for (const jornada of this.jornadas) {
        if (jornada.email === this.especialistaSelect?.mail) {

          if (dia !== 'domingo' && jornada.dias[dia].length > 0) {
            for (const horarioJor of jornada.dias[dia]) {
              const disp = this.existeHorarioEnTurnos(horarioJor, fecha.toLocaleDateString());
              const horarioAtencion: HorarioAtencion = {
                horario: horarioJor,
                especialistaEmail: jornada.email,
                disponible: disp
              };
              unDia.push(horarioAtencion);
            }
          }
        }
      }
      this.fechas = {
        [`${fecha.toLocaleDateString()}`]: unDia,
        dia: dia
      };
      this.turnosDisponibles.push(this.fechas);
    }
  }

  reset() {
    if (this.diaSelect) {
      this.diaSelect = null;
    }
    else if (this.especialistaSelect != null) {
      this.turnosDisponibles = null;
      this.especialistaSelect = null;
    }
    else if (this.especialidadSelect != '') {
      this.especialidadSelect = "";
    }
  }

  setFiltro(selector: string): void {
    //this.spinner.show();
    setTimeout(() => {
      this.filtroSelect = selector;
      //this.spinner.hide();
    }, 1000);
  }

  setEspecialista(esp: Especialista): void {
    //this.spinner.show();
    setTimeout(() => {
      this.especialistaSelect = esp;
      console.log(this.especialistaSelect);
      this.cargarTurnos();
      //this.spinner.hide();
    }, 1000);
  }

  setEspecialidad(esp: string): void {
    //this.spinner.show();
    setTimeout(() => {
      this.especialidadSelect = esp;
      console.log(this.especialidadSelect);
      this.filtrarEspecialistas(this.especialidadSelect);
      //this.spinner.hide();
    }, 1000);
  }

  filtrarEspecialistas(esp: string): void {
    this.especialistasDisponibles = [];
    for (const especialista of this.especialistas) {
      if (especialista.especialidades.includes(esp)) {
        this.especialistasDisponibles.push(especialista);
      }
    }
  }


  contieneEspecialidad(jornada: Jornada, esp: string): boolean {
    for (const especialista of this.especialistas) {
      if (especialista.mail === jornada.email) {
        if (especialista.especialidades.includes(esp)) {
          return true;
        }
        break;
      }
    }
    return false;
  }

  existeHorarioEnTurnos(horario: Horario, fecha: string): boolean {
    for (const turno of this.turnosActuales) {
      if (turno.horario.hora === horario.hora && turno.horario.nroConsultorio === horario.nroConsultorio && fecha === turno.fecha) {
        return false;
      }
    }
    return true;
  }

  generarTurno(fecha: string, turno: HorarioAtencion): void {
    this.turno = {
      horario: turno.horario,
      fecha: fecha,
      pacienteEmail: this.pacienteEmail,
      especialistaEmail: turno.especialistaEmail,
      especialidad: this.especialidadSelect,
      estado: 'pendiente',
      id: '',
      reseña: '',
      calificacion: '',
      encuesta: [],
      historial: false,
    }
    this.tur.agregarTurno(this.turno);
    /*Swal.fire({
      position: 'bottom-end',
      icon: 'success',
      title: 'Turno generado',
      footer: "Recuerde presentarse con el carnet de obra social",
      showConfirmButton: false,
      timer: 1500
    }).then(() => this.reset());*/
  }

  convertirDiaATexto(dia: number): string {
    const semana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    return semana[dia];
  }

  getKeyByIndex(array: any[], index: number): string {
    return Object.keys(array[index])[0];
  }

  getFecha(array: any[], index: number): string {
    const dato = this.getKeyByIndex(array, index);
    const fecha = dato.split('/')
    return fecha[0] + '/' + fecha[1];
  }

  getElementArray(array: any[], index: number): any[] {
    return array[index][this.getKeyByIndex(array, index)];
  }

  checkEmptyArray(array: any[]): boolean {
    for (let i = 0; i < array.length; i++) {
      if (this.getElementArray(array, i).length > 0) {
        return false;
      }
    }
    return true;
  }

  getDate(date: string): Date {
    return new Date(date);
  }

  getFechaTurno(select: HorarioAtencion, index: number, dia: string): void {
    console.log(dia);
    this.indexDiaSelect = index;
    this.diaSelect = select;
    this.diaNombreSelect = dia;


  }
}
