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
import { UserService } from '../../../services/user.service';
import { Especialidades } from '../../../interfaces/especialidades';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { FechaHoraFormatPipe } from "../../../pipes/fecha-hora-format.pipe";

@Component({
    selector: 'app-solicitar-turno',
    standalone: true,
    templateUrl: './solicitar-turno.component.html',
    styleUrls: ['./solicitar-turno.component.css'],
    imports: [CommonModule, HoraFormatPipe, RouterLink, FechaHoraFormatPipe]
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
  public especialidades: Especialidades[] = [];
  public especialidadesDisponibles: Especialidades[] = [];
  public filtroSelect: string = "";
  public especialidadSelect: Especialidades | null = null;
  public especialistaSelect: Especialista | null = null;
  public diaSelect: HorarioAtencion | null = null;
  public indexDiaSelect: number = 0;
  public diaNombreSelect: string = '';
  public nombreEspecialidades : string [] = [];
  public nombreEspecialidad : string = '';

  constructor(
    private spinner: NgxSpinnerService, 
    private userService: UserService,
    private jor: JornadaService, 
    private tur: TurnoService, 
    private auth: AuthService, 
    private esp: EspecialistaService, 
    private especial: EspecialidadesService
  ) { }

  ngOnInit(): void {
    this.pacienteEmail = this.userService.currentUser.mail;
    this.esp.obtenerEspecialistas().subscribe(esp => this.especialistas = esp);
    this.especial.getAllEspecialidades().subscribe(esp => this.especialidades = esp);
    this.jor.traerJornadas().subscribe(res => {
      this.jornadas = res;
      this.tur.traerTurnos().subscribe(data => this.turnosActuales = data);
    });
  }

  // onSelectEspecialista(email: string): void {
  //   const selectedEspecialista = this.especialistas.find(esp => esp.mail === email);
  //   if (selectedEspecialista) {
  //     this.especialistaSelect = selectedEspecialista;
  //     this.especialidadesDisponibles = selectedEspecialista.especialidades;
  //   } else {
  //     this.especialistaSelect = null;
  //     this.especialidadesDisponibles = [];
  //   }
  // }

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
      if (index != 0) fecha.setDate(fecha.getDate() + 1);

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
    } else if (this.especialidadSelect != undefined) {
      this.turnosDisponibles = null;
      this.especialidadSelect = null;
      this.especialidadesDisponibles = [];
    } else if (this.especialistaSelect != null) {
      this.especialistaSelect = null;
    }
  }

  setFiltro(selector: string): void {
    this.spinner.show();
    setTimeout(() => {
      this.filtroSelect = selector;
      this.spinner.hide();
    }, 1000);
  }

  setEspecialista(esp: Especialista): void {
    this.spinner.show();
    setTimeout(() => {
      this.especialistaSelect = esp;
      this.filtrarEspecialidades(this.especialistaSelect)
      this.cargarTurnos();
      this.spinner.hide();
    }, 1000);
  }

  setEspecialidad(esp: Especialidades): void {
    this.spinner.show();
    console.log(esp);
    setTimeout(() => {
      this.especialidadSelect = esp;
      console.log(this.especialidadSelect);
      this.spinner.hide();
    }, 1000);
  }

  filtrarEspecialidades(esp: Especialista): void {
    this.especialidadesDisponibles = []; // Limpiamos el array antes de agregar nuevos datos
  
    // Buscamos al especialista dentro de la lista de especialistas
    const especialista = this.especialistas.find(e => e.mail === esp.mail);
    
    if (especialista) {
      // Iteramos sobre las especialidades del especialista
      esp.especialidades.forEach(nombre => {
        // Buscamos la especialidad por nombre usando el servicio
        this.especial.getEspecialidad(nombre).subscribe(data => {
          if (data) {
            // Si encontramos la especialidad, la agregamos a las disponibles
            this.especialidadesDisponibles.push(data);
            console.log(this.especialidadesDisponibles);
          } else {
            console.error(`No se encontró la especialidad ${nombre}`);
          }
        });
      });
    } else {
      console.error(`No se encontró al especialista con email ${esp.mail}`);
    }
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
    
    if(this.especialidadSelect){
      this.turno = {
        horario: turno.horario,
        fecha: fecha,
        pacienteEmail: this.pacienteEmail,
        especialistaEmail: turno.especialistaEmail,
        especialidad: this.especialidadSelect.nombre,
        estado: 'pendiente',
        id: '',
        reseña: '',
        calificacion: 0,
        encuesta: [],
        historial: null
      }
      this.tur.agregarTurno(this.turno);
      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Turno generado',
        footer: "Recuerde presentarse con el carnet de obra social",
        showConfirmButton: false,
        timer: 1500
      }).then(() => this.reset());
    }
    
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
    const [day, month, year] = dato.split('/');
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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

