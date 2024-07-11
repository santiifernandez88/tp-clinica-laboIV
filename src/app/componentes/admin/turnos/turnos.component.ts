import { Component } from '@angular/core';
import { Especialista } from '../../../interfaces/especialista';
import { Turno } from '../../../interfaces/turno';
import { TurnoService } from '../../../services/turno.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EspecialistaService } from '../../../services/especialista.service';
import { EspecialidadesService } from '../../../services/especialidades.service';
import { Especialidades } from '../../../interfaces/especialidades';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {

  public turnos: Turno[] = [];
  public turnosDisponibles: Turno[] | null = null;
  public filtroSelect: string = "";
  public especialidadSelect: string = "";
  public especialistaSelect: Especialista | null = null;
  public especialistas: Especialista[] = [];
  public especialidades: Especialidades[] = [];

  constructor(private tur: TurnoService, private spinner: NgxSpinnerService, private esp: EspecialistaService, private especial: EspecialidadesService) { }

  ngOnInit(): void {
    this.tur.traerTurnos().pipe(
      map(turnos => turnos.filter(turno => turno.estado === 'pendiente'))
    ).subscribe(turnos => this.turnos = turnos);
    this.esp.obtenerEspecialistas().subscribe(data => this.especialistas = data);
    this.especial.getAllEspecialidades().subscribe(data => this.especialidades = data);
  }

  reset() {
    this.filtroSelect = "";
    this.especialistaSelect = null;
    this.especialidadSelect = "";
    this.turnosDisponibles = null;
  }

  setFiltro(selector: string): void {
    this.spinner.show();
    setTimeout(() => {
      this.filtroSelect = selector;
      if (this.filtroSelect == "todos") {
        this.turnosDisponibles = this.turnos
      } else {
        this.turnosDisponibles = [];
      }
      this.spinner.hide();
    }, 1000);
  }

  setEspecialista(esp: Especialista): void {
    this.spinner.show();
    setTimeout(() => {
      this.especialistaSelect = esp;
      console.log(this.especialistaSelect);
      for (const turno of this.turnos) {
        if (turno.especialistaEmail === esp.mail) {
          this.turnosDisponibles?.push(turno);
        }
      }
      this.spinner.hide();
    }, 1000);

  }

  setEspecialidad(esp: string): void {
    this.spinner.show();

    setTimeout(() => {
      this.especialidadSelect = esp;
      //console.log(this.especialidadSelect);
      this.tur.traerTurnos().pipe(
        map(turnos => turnos.filter(turno => turno.especialidad === this.especialidadSelect && turno.estado == "pendiente"))
      ).subscribe(turnos => this.turnosDisponibles = turnos);
      this.spinner.hide();
    }, 1000);

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

  getData(email: string): Especialista | null {
    for (const esp of this.especialistas) {
      if (esp.mail === email) {
        return esp;
      }
    }
    return null
  }


  cancelar(turno: Turno): void {
    Swal.fire({
      title: "Cancelar Turno?",
      text: "No podras revertirlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#339933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancelar Turno"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: text } = await Swal.fire({
          input: "textarea",
          inputLabel: "Cancelar el Turno",
          inputPlaceholder: "Ingrese la razon por la cual quiere cancelar el turno",
          inputAttributes: {
            "aria-label": "Type your message here"
          },
          showCancelButton: true
        });
        if (text) {
          Swal.fire({
            title: "Cancelado!",
            text: `El turno fue cancelado con exito`,
            icon: "error"
          }).then(() => {
            turno.reseña = text;
            turno.estado = "cancelado";
            this.tur.updateTurno(turno);
            // this.traerTurnos();
          });
        }

      }
    });
  }
}
