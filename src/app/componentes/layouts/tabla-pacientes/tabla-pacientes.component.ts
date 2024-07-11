import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Paciente } from '../../../interfaces/paciente';
import { PacienteService } from '../../../services/paciente.service';
import { TurnoService } from '../../../services/turno.service';
import { Turno } from '../../../interfaces/turno';
import { trigger, animate, transition, style } from '@angular/animations';


@Component({
  selector: 'app-tabla-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-pacientes.component.html',
  styleUrl: './tabla-pacientes.component.css',
  animations: [
    trigger('sliderInFromBottom', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class TablaPacientesComponent {

  public pacientes : Paciente[] = []
  private paciente : Paciente | undefined;
  public turnosHist: Turno[] = []
  public mostrarHis: boolean | undefined = undefined;

  constructor(private pacienteService: PacienteService, private tur: TurnoService){}

  ngOnInit(): void {
    this.pacienteService.obtenerPacientes().subscribe( respuesta => {
      this.pacientes = new Array<Paciente>();
      respuesta.forEach((pac: Paciente)=> {
        this.paciente =
        {
          nombre: pac.nombre,
          apellido: pac.apellido,
          edad: pac.edad,
          dni: pac.dni,
          obraSocial: pac.obraSocial,
          mail: pac.mail,
          password: pac.password,
          fotoPerfilUno: pac.fotoPerfilUno,
          fotoPerfilDos: pac.fotoPerfilDos,
        };
        this.pacientes?.push(this.paciente);
      })
    })
  }

  getHistorial(paciente : Paciente){
    this.tur.traerTurnosByEmailPaciente(paciente.mail).subscribe(turHis => {
      this.turnosHist = turHis.filter(his => his.historial?.pacienteEmail === paciente.mail);
      if(this.turnosHist.length <= 0){
        this.mostrarHis = false;
      } else{
        this.mostrarHis = true;
      }
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

  reset() {
    this.turnosHist = [];
  }

}
