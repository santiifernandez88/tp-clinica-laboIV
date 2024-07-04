import { Component, OnInit } from '@angular/core';
import { Paciente } from '../../../interfaces/paciente';
import { PacienteService } from '../../../services/paciente.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit{
  
  paciente!: Paciente;
  
  constructor(private pacienteService : PacienteService, private userService: UserService){}
  
  ngOnInit(): void {
    this.pacienteService.obtenerPacientes().subscribe(respuesta => {
      respuesta.forEach((pac: Paciente)=> {
        if(this.userService.currentUser.mail == pac.mail){
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
          return;
        }
      });
    });
  }

  

}
