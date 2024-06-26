import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Especialista } from '../../../interfaces/especialista';
import { EspecialistaService } from '../../../services/especialista.service';

@Component({
  selector: 'app-tabla-especialistas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-especialistas.component.html',
  styleUrl: './tabla-especialistas.component.css'
})
export class TablaEspecialistasComponent {

  public especialistas : Especialista[] = []
  private especialista : Especialista | undefined;

  constructor(private especialistaService: EspecialistaService){}

  ngOnInit(): void {
    this.especialistaService.obtenerEspecialistas().subscribe( respuesta => {
      this.especialistas = new Array<Especialista>();
      respuesta.forEach((esp: Especialista)=> {
        this.especialista =
        {
          nombre: esp.nombre,
          apellido: esp.apellido,
          edad: esp.edad,
          dni: esp.dni,
          especialidades: esp.especialidades,
          mail: esp.mail,
          password: esp.password,
          fotoPerfil: esp.fotoPerfil,
          habilitado : esp.habilitado
        };
        this.especialistas?.push(this.especialista);
      })
    })
  }

  habilitarEspecialista(especialista: Especialista){
    especialista.habilitado = true;
    this.especialistaService.updateEspecialista(especialista);
  }

  deshabilitarEspecialista(especialista: Especialista){
    especialista.habilitado = false;
    this.especialistaService.updateEspecialista(especialista);
  }
}
