import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { AdminService } from '../../services/admin.service';
import { EspecialistaService } from '../../services/especialista.service';
import { PacienteService } from '../../services/paciente.service';
import { Admin } from '../../interfaces/admin';
import { Especialista } from '../../interfaces/especialista';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  flagError: boolean = false;
  loggedUser: string = "";
  msjError: string = "";
  resetPasswordMessage : string = "";
  modalEnable : boolean = false;

  constructor(private router: Router, public auth: AuthService, private adminService: AdminService, private userService: UserService) {}

  LoginUser() {
    console.log(this.email);
    console.log(this.password);
    this.auth.Login(this.email, this.password).then((res) => {
      if (res.user.email !== null){
        this.adminService.obtenerAdministradores().subscribe( respuesta => {
          respuesta.forEach((adm: Admin)=> {
            if(adm.mail == res.user.email){
              this.auth.userActive = res.user
            }
          })
        })
        if(res.user.emailVerified){
          this.auth.userActive = res.user;
        }
        this.goTo("home")
        this.flagError = false;
        this.userService.rolLogin();
      }
      
    }).catch((e) => {

      this.flagError = true;

      switch(e.code) {
        case "auth/invalid-email":
          this.msjError = "Email invalido";
          break;
        case "auth/invalid-credential":
          this.msjError = "El email o contraseña son incorrectos";
          break;
        case "auth/missing-password":
          this.msjError = "Por favor introduzca una contraseña";
          break;
        case "auth/too-many-requests":
          this.msjError = "Por favor ingrese bien sus datos";
          break;
        default:
          if (e.message === 'Email not verified') {
            this.msjError = 'Por favor, verifica tu correo electrónico antes de iniciar sesión.';
          } else {
            this.msjError = "Error desconocido: " + e.message;
          }
      }
    });
  }

  Rellenar(email : string, password : string) {
    this.email = email;
    this.password = password;
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  async resetPassword() {
    try {
      this.resetPasswordMessage = await this.auth.resetPassword(this.email);
      this.flagError = false;
    } catch (error: any) {
      this.flagError = true;
      this.msjError = error.message;
    }
  }

}
