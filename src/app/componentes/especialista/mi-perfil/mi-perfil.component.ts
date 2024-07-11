import { Component } from '@angular/core';
import { Especialista } from '../../../interfaces/especialista';
import { EspecialistaService } from '../../../services/especialista.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HorariosComponent } from "../../layouts/horarios/horarios.component";
import { CapitalizePipe } from "../../../pipes/capitalize.pipe";

@Component({
    selector: 'app-mi-perfil',
    standalone: true,
    templateUrl: './mi-perfil.component.html',
    styleUrl: './mi-perfil.component.css',
    imports: [CommonModule, RouterLink, HorariosComponent, CapitalizePipe]
})
export class MiPerfilComponent {

  especialista!: Especialista;
  
  constructor(private especialistaService : EspecialistaService, private userService: UserService, private router: Router){}
  
  ngOnInit(): void {
    this.especialistaService.obtenerEspecialistas().subscribe(respuesta => {
      respuesta.forEach((esp: Especialista)=> {
        if(this.userService.currentUser.mail == esp.mail){
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
          return;
        }
      });
    });
  }

  goTo(url: string, accion: string): void {
    this.userService.accionHorarios = accion;
    this.router.navigateByUrl(url);
  }
}
