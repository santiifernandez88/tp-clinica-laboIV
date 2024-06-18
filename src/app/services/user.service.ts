import { Injectable } from '@angular/core';
import { AdminService } from './admin.service';
import { AuthService } from './auth.service';
import { Admin } from '../interfaces/admin';
import { PacienteService } from './paciente.service';
import { Paciente } from '../interfaces/paciente';
import { EspecialistaService } from './especialista.service';
import { Especialista } from '../interfaces/especialista';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  admin : boolean = false;
  paciente: boolean = false;
  especialista : boolean = false;
  mapped_array!: Array<any>;

  constructor(private adminService: AdminService, private auth: AuthService, private pacienteService: PacienteService, private especialistaService: EspecialistaService) { }

  esAdmin() {
    this.adminService.obtenerAdministradores().subscribe(respuesta => {
      this.admin = respuesta.map((adm : Admin) => {return adm.mail}).includes(this.auth.userActive.email);
      console.log(this.admin);
      console.log(this.auth.userActive);
    });
  }

  esPaciente() {
    this.pacienteService.obtenerPacientes().subscribe(respuesta => {
      
      this.paciente = respuesta.map((pac : Paciente) => {return pac.mail}).includes(this.auth.userActive.email);
      console.log(this.paciente);
    });
  }

  esEspecialista() {
    this.especialistaService.obtenerEspecialistas().subscribe(respuesta => {
      this.especialista = respuesta.map((esp : Especialista) => {return esp.mail}).includes(this.auth.userActive.email);
      console.log(this.especialista);
    });
  }

  rolLogin() {
    this.esAdmin();
    this.esPaciente();
    this.esEspecialista();
  }

  rolLogout(){
    this.admin = false;
    this.especialista = false;
    this.paciente = false;
  }

}
