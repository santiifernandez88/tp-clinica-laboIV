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
import { Auth } from '@angular/fire/auth';

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
  sendingRequest!: boolean;
  especialistaHabilitado : boolean = true

  constructor(private router: Router, public auth: AuthService, private realAuth : Auth, private especialistaService: EspecialistaService, private userService: UserService) {}

  async LoginUser() {
    if(!this.sendingRequest){
      this.sendingRequest = true;
      this.auth.Login(this.email, this.password).then((res) => {
        if (res.user && res.user.email !== null){
          if(res.user.emailVerified){
           
            if(this.userService.especialista){
              if(this.especialistaHabilitado){
                this.auth.userActive = res.user;
                this.userService.currentUser.mail = this.email;
                this.userService.currentUser.password = this.password;
              } else{
                this.flagError = true;
                this.msjError = 'Por favor, espera a que un admin habilite tu correo electrónico antes de iniciar sesión.';
                this.realAuth.signOut();
              }       
            } else{
              this.auth.userActive = res.user;
              this.userService.currentUser.mail = this.email;
              this.userService.currentUser.password = this.password;
            } 
          } else {
            this.flagError = true;
            this.msjError = 'Por favor, verifica tu correo electrónico antes de iniciar sesión.';
            this.realAuth.signOut();
          }
          this.goTo("home");
          console.log("LOCAL USER: ");
          console.log(this.auth.userActive);
          console.log("AUTH USER: ");
          console.log(this.realAuth.currentUser);
          
        }
        this.sendingRequest = false;
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
            this.msjError = "Por favor ingrese bien sus datos";
            break;

        }
        this.sendingRequest = false;
      });
    }
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
