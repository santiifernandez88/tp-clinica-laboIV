import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Especialista } from '../../interfaces/especialista';
import { EspecialistaService } from '../../services/especialista.service';
import { TablaEspecialistasComponent } from '../layouts/tabla-especialistas/tabla-especialistas.component';
import { TablaPacientesComponent } from '../layouts/tabla-pacientes/tabla-pacientes.component';
import { RouterLink } from '@angular/router';
import { RegistroAdminComponent } from '../registers/registro-admin/registro-admin.component';
import { TablaAdministradoresComponent } from '../layouts/tabla-administradores/tabla-administradores.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, TablaEspecialistasComponent, TablaPacientesComponent, RouterLink, RegistroAdminComponent, TablaAdministradoresComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  public radio: string = "1";

  ngOnInit(): void {
    
  }

}
