import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Paciente } from '../../../interfaces/paciente';
import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-tabla-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-pacientes.component.html',
  styleUrl: './tabla-pacientes.component.css'
})
export class TablaPacientesComponent {

  public pacientes : Paciente[] = []
  private paciente : Paciente | undefined;

  constructor(private pacienteService: PacienteService){}

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

}
