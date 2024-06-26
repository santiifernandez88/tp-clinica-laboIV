import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { Admin } from '../../../interfaces/admin';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../interfaces/paciente';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public boolAdmin: boolean = false; 
  public boolPaciente: boolean = false; 
  public mailAdmin: string = '';

  constructor(
    public auth: AuthService,
    public userService: UserService,
    private router: Router,
   
  ) {}

  CloseSession() {
    this.auth.logout();
    this.router.navigateByUrl("login");
  }
}
