import { Injectable } from '@angular/core';
import { AdminService } from './admin.service';
import { AuthService } from './auth.service';
import { Admin } from '../interfaces/admin';
import { PacienteService } from './paciente.service';
import { Paciente } from '../interfaces/paciente';
import { EspecialistaService } from './especialista.service';
import { Especialista } from '../interfaces/especialista';
import { Usuario } from '../interfaces/usuario';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  admin : boolean = false;
  paciente: boolean = false;
  especialista : boolean = false;
  especialistaHabilitado : boolean = false;
  currentUser: Usuario = {
    mail: "",
    password: ""
  }

  constructor(private adminService: AdminService, private auth: AuthService, private pacienteService: PacienteService, private especialistaService: EspecialistaService) {
    this.esAdmin();
    this.esPaciente();
    this.esEspecialista(); 
  }

  esAdmin() {
    this.adminService.obtenerAdministradores().subscribe(respuesta => {
      if(this.auth.userActive != null){
        this.admin = respuesta.map((adm : Admin) => {return adm.mail}).includes(this.auth.userActive.email);
      } else {
        this.admin = false;
      }
    });
  }

  esPaciente() {
    this.pacienteService.obtenerPacientes().subscribe(respuesta => {
      if(this.auth.userActive != null){
        this.paciente = respuesta.map((pac : Paciente) => {return pac.mail }).includes(this.auth.userActive.email);
      } else {
        this.paciente = false;
      }
    });
  }

  esEspecialista() {
    this.especialistaService.obtenerEspecialistas().subscribe(respuesta => {
      if(this.auth.userActive != null){
        respuesta.forEach((esp : Especialista) => {
          if(esp.mail === this.auth.userActive.email) {
            this.especialista = true;
            this.especialistaHabilitado = esp.habilitado;
            console.log("El especialista es: " + esp.mail + " y esta habilitado en: " + esp.habilitado);
          }
        });
      } else {
        this.especialista = false;
        this.especialistaHabilitado = false;
      }
    });
  }

  // async esEspecialistaHabilitado(): Promise<boolean> {
  //   const especialista: Especialista | null = await this.especialistaService.obtenerEspecialistaPorEmail(this.auth.userActive?.email);
  //   if (especialista && especialista.habilitado) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // async verificarAntesDeLogin() {
  //   if (this.auth.userActive) {
  //     const habilitado = await this.esEspecialistaHabilitado();
  //     if (!habilitado) {
  //       throw new Error('El especialista no está habilitado.');
  //     }
  //   }
  // }
}

