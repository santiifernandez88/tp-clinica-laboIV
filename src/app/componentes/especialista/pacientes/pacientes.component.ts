import { Component, OnInit } from '@angular/core';
import { DatoDinamico, HistoriaClinica } from '../../../interfaces/historiaClinica';
import { Paciente } from '../../../interfaces/paciente';
import { PacienteService } from '../../../services/paciente.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../../services/turno.service';
import { Turno } from '../../../interfaces/turno';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  public historialClinico: Turno[] = [];
  public especialistaEmail!: string;
  public pacientes: Paciente[] = [];
  public todosHistorialClinicos: HistoriaClinica[] = [];
  public turnos: Turno[] = [];

  constructor(private pac: PacienteService, private userService: UserService, private tur: TurnoService) { }

  ngOnInit(): void {
    this.especialistaEmail = this.userService.currentUser.mail;
    this.tur.traerTurnosByEmailEspecialista(this.especialistaEmail).subscribe(turn => {
      const pacienteEmails = new Set<string>();
      this.turnos = turn;
      this.turnos.forEach(element => {
        if (!pacienteEmails.has(element.pacienteEmail)) {
          pacienteEmails.add(element.pacienteEmail);
          this.pac.traerPacientePorMail(element.pacienteEmail).subscribe(pacien => {
            if (pacien) {
              this.pacientes.push(pacien);
            }
          });
        }
      });
    });
  }

  getPaciente(email: string): string {
    for (const pac of this.pacientes) {
      if (pac.mail === email) {
        return `${pac.nombre} ${pac.apellido}`;
      }
    }
    return '';
  }

  sacarKey(datos: DatoDinamico) {
    return Object.keys(datos)[0];
  }

  getHistorial(paciente: Paciente) {
    this.tur.traerTurnosByEmailPaciente(paciente.mail).subscribe(turHis => {
      // Ordenar por fecha y hora
      const sortedTurnos = turHis.sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.horario.hora}`);
        const dateB = new Date(`${b.fecha}T${b.horario.hora}`);
        return dateB.getTime() - dateA.getTime(); // Orden descendente (más recientes primero)
      });
  
      // Filtrar y obtener los últimos 3 turnos
      this.historialClinico = sortedTurnos.filter(his => his.pacienteEmail === paciente.mail).slice(0, 3);
    });
  }

  reset() {
    this.historialClinico = [];
  }
}
