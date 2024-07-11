import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Especialista } from '../../../interfaces/especialista';
import { Paciente } from '../../../interfaces/paciente';
import { PacienteService } from '../../../services/paciente.service';
import { EspecialistaService } from '../../../services/especialista.service';
import { TurnoService } from '../../../services/turno.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  public pacientes: Paciente[] = [];
  public especialistas: Especialista[] = [];
  public paciente!: Paciente;
  public especialista!: Especialista;

  constructor(
    private pacServ: PacienteService,
    private espServ: EspecialistaService,
    private tur: TurnoService
  ) {}

  ngOnInit(): void {
    this.pacServ.obtenerPacientes().subscribe(pac => {
      this.pacientes = pac;
    });
    this.espServ.obtenerEspecialistas().subscribe(esp => {
      this.especialistas = esp;
    });
  }

  getEspecialista(email: string): string {

    for (const esp of this.especialistas) {
      if (esp.mail === email) {
        return `${esp.nombre} ${esp.apellido}`;
      }
    }
    return '';
  }

  getPaciente(email: string): string {

    for (const pac of this.pacientes) {
      if (pac.mail === email) {
        return `${pac.nombre} ${pac.apellido}`;
      }
    }
    return '';
  }

  downloadExcel(user: Paciente | Especialista) {
    let data: any = [];
    if ((user as Paciente).obraSocial) { // Paciente
      console.log("pase el if de que soy un paciente")
      this.pacServ.traerPacientePorMail(user.mail).subscribe(pac => {
        if (pac) {
          user = pac;
          console.log("asigne el user al paciente" + user);
          this.tur.traerTurnosByEmailPaciente(user.mail).subscribe(turn => {
            data = turn.map(turno => ({
              Paciente: this.getPaciente(user.mail),
              Especialista: this.getEspecialista(turno.especialistaEmail),
              Especialidad: turno.especialidad,
              Fecha: `${turno.fecha} ${turno.horario.hora}`
            }));
            console.log("cree la data del turno" + data);
            this.generateExcel(data, `${user.nombre}_${user.apellido}_turnos.xlsx`);
          });
        }
      });
    } else { // Especialista
      console.log("pase al else");
      this.espServ.traerPorEmail(user.mail).subscribe(esp => {
        if (esp) {
          user = esp;
          this.tur.traerTurnosByEmailEspecialista(user.mail).subscribe(turnos => {
            data = turnos.map(turno => ({
              Especialista: `${user.nombre} ${user.apellido}`,
              Especialidad: turno.especialidad,
              Paciente: this.getPaciente(turno.pacienteEmail),
              Fecha: `${turno.fecha} ${turno.horario.hora}`
            }));
            this.generateExcel(data, `${user.nombre}_${user.apellido}_turnos.xlsx`);
          });
        }
      });
    }
  }

  generateExcel(data: any[], filename: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Turnos');
    XLSX.writeFile(wb, filename);
  }
}
