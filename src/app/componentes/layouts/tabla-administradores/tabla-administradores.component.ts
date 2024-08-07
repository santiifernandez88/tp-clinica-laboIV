import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Admin } from '../../../interfaces/admin';
import { AdminService } from '../../../services/admin.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-tabla-administradores',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './tabla-administradores.component.html',
  styleUrl: './tabla-administradores.component.css',
  animations: [
    trigger('sliderInFromBottom', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class TablaAdministradoresComponent {

  public administradores : Admin[] = []
  private admin : Admin | undefined;

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.adminService.obtenerAdministradores().subscribe( respuesta => {
      this.administradores = new Array<Admin>();
      respuesta.forEach((adm: Admin)=> {
        this.admin =
        {
          nombre: adm.nombre,
          apellido: adm.apellido,
          edad: adm.edad,
          dni: adm.dni,
          mail: adm.mail,
          password: adm.password,
          img: adm.img,
        };
        this.administradores?.push(this.admin);
      })
    })
  }
}
