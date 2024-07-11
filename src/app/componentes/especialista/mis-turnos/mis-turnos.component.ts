import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../interfaces/turno';
import Swal from 'sweetalert2';
import { TurnoService } from '../../../services/turno.service';
import { PacienteService } from '../../../services/paciente.service';
import { UserService } from '../../../services/user.service';
import { Paciente } from '../../../interfaces/paciente';
import { CommonModule } from '@angular/common';
import { HistorialComponent } from '../../layouts/historial/historial.component';
import { RouterLink } from '@angular/router';
import { EstadoTurnoDirective } from '../../../directivas/estado-turno.directive';
import { EstadoTextoDirective } from '../../../directivas/estado-texto.directive';
import { TituloDirective } from '../../../directivas/titulo.directive';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css'],
  imports: [CommonModule, HistorialComponent, RouterLink, EstadoTurnoDirective, EstadoTextoDirective, TituloDirective]
})
export class MisTurnosComponent implements OnInit {

  public email!: string;
  public turnos: Turno[] = [];
  public turnosMostrar: Turno[] = [];
  public pacientes: Paciente[] = [];
  public mostrarHistorial: boolean = false;

  constructor(private tur: TurnoService, private pac: PacienteService, private cUser: UserService) { }

  ngOnInit(): void {
    this.pac.traer().subscribe(data => this.pacientes = data);
    this.traerTurnos();
  }

  traerTurnos() {
    this.email = this.cUser.currentUser.mail;
    this.tur.traerTurnosByEmailEspecialista(this.email)
      .subscribe(turnos => {
        this.turnos = turnos;
        this.turnosMostrar = turnos;
      });
  }

  getPaciente(email: string): string {
    const pac = this.pacientes.find(p => p.mail === email);
    return pac ? `${pac.nombre} ${pac.apellido}` : '';
  }

  async cancelar(turno: Turno) {
    const result = await Swal.fire({
      title: "Cancelar Turno?",
      text: "No podrás revertirlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#339933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancelar Turno"
    });

    if (result.isConfirmed) {
      const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "Cancelar el Turno",
        inputPlaceholder: "Ingrese la razón por la cual quiere cancelar el turno",
        inputAttributes: { "aria-label": "Type your message here" },
        showCancelButton: true
      });

      if (text) {
        Swal.fire({
          title: "Cancelado!",
          text: `El turno fue cancelado con éxito`,
          icon: "error"
        }).then(() => {
          turno.reseña = text;
          turno.estado = "cancelado";
          this.tur.updateTurno(turno);
          this.traerTurnos();
        });
      }
    }
  }

  async rechazar(turno: Turno) {
    const result = await Swal.fire({
      title: "Rechazar Turno?",
      text: "No podrás revertirlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#339933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Rechazar"
    });

    if (result.isConfirmed) {
      const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "Rechazar el Turno",
        inputPlaceholder: "Ingrese la razón por la cual quiere rechazar el turno",
        inputAttributes: { "aria-label": "Type your message here" },
        showCancelButton: true
      });

      if (text) {
        Swal.fire({
          title: "Rechazado!",
          text: `El turno fue rechazado con éxito`,
          icon: "error"
        }).then(() => {
          turno.reseña = text;
          turno.estado = "rechazado";
          this.tur.updateTurno(turno);
          this.traerTurnos();
        });
      }
    }
  }

  aceptar(turno: Turno): void {
    Swal.fire({
      title: "Aceptar Turno?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#339933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Aceptado!",
          text: `El paciente lo visitará ${turno.fecha} a las ${turno.horario.hora} en el consultorio ${turno.horario.nroConsultorio}.`,
          icon: "success"
        }).then(() => {
          turno.estado = "aceptado";
          this.tur.updateTurno(turno);
          this.traerTurnos();
        });
      }
    });
  }

  verCalificacion(turno: Turno) {
    Swal.fire({
      title: 'Calificación',
      text: `La calificación es: ${turno.calificacion}`,
      icon: 'info'
    });
  }

  async finalizar(turno: Turno) {
    const result = await Swal.fire({
      title: "Finalizar Turno?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#339933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Finalizar Turno"
    });

    if (result.isConfirmed) {
      const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "Finalización de Turno",
        inputPlaceholder: "Deje una reseña o comentario de la consulta y diagnóstico realizado...",
        inputAttributes: { "aria-label": "Type your message here" },
        showCancelButton: true
      });

      if (text) {
        Swal.fire({
          title: "Finalizado!",
          text: `El paciente recibirá su diagnóstico.`,
          icon: "success"
        }).then(() => {
          turno.reseña = text;
          turno.estado = "finalizado";
          this.tur.updateTurno(turno);
          this.traerTurnos();
        });
      }
    }
  }

  async cargarHistorial(turno: Turno) {
    this.mostrarHistorial = true;
    this.cUser.idPacienteHistorial = this.getIdPaciente(turno.pacienteEmail);
    this.cUser.turno = turno;
  }

  getIdPaciente(pacienteEmail: string): number {
    const pac = this.pacientes.find(p => p.mail === pacienteEmail);
    return pac ? pac.dni : -1;
  }

  getHistorial(turno: Turno) {
    let datosDinamicos = '';
    
    if (turno.historial?.datos) {
      datosDinamicos = turno.historial.datos.map(dato => `<p>${dato['clave']}: ${dato['valor']}</p>`).join('');
    }
  
    Swal.fire({
      title: 'Historia Clínica',
      html: `
        <p>Altura: ${turno.historial?.altura}</p>
        <p>Peso: ${turno.historial?.peso}</p>
        <p>Presión: ${turno.historial?.presion}</p>
        <p>Temperatura: ${turno.historial?.temperatura}</p>
        <p>Datos Dinámicos:</p>
        ${datosDinamicos}
      `,
      icon: 'info'
    });
  }
  

  contieneSubcadenaIgnoreCase(cadenaPrincipal: string, subcadena: string): boolean {
    return cadenaPrincipal.toLowerCase().includes(subcadena.toLowerCase());
  }

  getFiltro(event: any) {
    const valor = event.target.value;

    if (valor === '') {
      this.turnosMostrar = this.turnos;
    } else {
      this.turnosMostrar = this.turnos.filter(turno => 
        this.contieneSubcadenaIgnoreCase(turno.estado, valor) ||
        this.contieneSubcadenaIgnoreCase(turno.fecha, valor) ||
        this.contieneSubcadenaIgnoreCase(turno.especialidad, valor) ||
        this.contieneSubcadenaIgnoreCase(turno.horario.hora, valor) ||
        this.contieneSubcadenaIgnoreCase(this.getPaciente(turno.pacienteEmail), valor) ||
        (turno.historial && 
          (this.contieneSubcadenaIgnoreCase(turno.historial.altura, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.historial.peso, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.historial.presion, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.historial.temperatura, valor) ||
          turno.historial.datos.some(dato => 
            this.contieneSubcadenaIgnoreCase(dato['clave'], valor) || 
            this.contieneSubcadenaIgnoreCase(dato['valor'], valor)
          ))
        )
      );
    }
  }
}
