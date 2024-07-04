import { Component, OnInit } from '@angular/core';
import { Jornada } from '../../../interfaces/jornada';
import { AuthService } from '../../../services/auth.service';
import { JornadaService } from '../../../services/jornada.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {

  public email!: string;
  public jornada!: Jornada;
  public selected: string = 'lunes';

  constructor(private userServ: UserService, private jor: JornadaService) { }

  ngOnInit(): void {
    this.email = this.userServ.currentUser.mail;
    this.jor.traerJornada(this.email).subscribe(jornada => {
      this.jornada = jornada
    });
          
  }


  changeSelect(sel: string) {
    this.selected = sel;
  }
}