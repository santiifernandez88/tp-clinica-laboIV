import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Cronograma, Dias, Horario, HorarioCronograma, Jornada, JornadaDiaView, convertirJornadaACronograma, esJornadaValida } from '../../../interfaces/jornada';
import { JornadaService } from '../../../services/jornada.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-mis-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.css']
})
export class MisHorariosComponent implements OnInit {

  public accion: string = '';
  public cronograma!: Cronograma;
  public email: string = '';
  public lunes!: JornadaDiaView;
  public martes!: JornadaDiaView;
  public miercoles!: JornadaDiaView;
  public jueves!: JornadaDiaView;
  public viernes!: JornadaDiaView;
  public sabado!: JornadaDiaView;
  public lunesConsultorio: string = 'consultorio1';
  public martesConsultorio: string = 'consultorio1';
  public miercolesConsultorio: string = 'consultorio1';
  public juevesConsultorio: string = 'consultorio1';
  public viernesConsultorio: string = 'consultorio1';
  public sabadoConsultorio: string = 'consultorio1';
  public jornadaEsp!: Jornada;
  public diasEsp!: Dias;
  public lunesHorario!: Horario[];
  public martesHorario!: Horario[];
  public miercolesHorario!: Horario[];
  public juevesHorario!: Horario[];
  public viernesHorario!: Horario[];
  public sabadoHorario!: Horario[];
  public jornadaVieja!: Jornada;

  constructor(private userService: UserService, private jor: JornadaService, private auth: AuthService) { }

  ngOnInit(): void {
    this.accion = this.userService.accionHorarios;
    this.email = this.userService.currentUser.mail;
    //this.jor.generarJornadaInicial();
    this.jor.traerJornada(this.email).subscribe(data => {
      this.jornadaVieja = data;
      this.jor.traerCronograma().subscribe((res) => {
        if (this.accion == "agregar") {
          
            this.lunes = this.jor.getHorario(res, 'lunes');
            this.martes = this.jor.getHorario(res, 'martes');
            this.miercoles = this.jor.getHorario(res, 'miercoles');
            this.jueves = this.jor.getHorario(res, 'jueves');
            this.viernes = this.jor.getHorario(res, 'viernes');
            this.sabado = this.jor.getHorario(res, 'sabado');

            this.filtrarTomados();
        }
        else if (this.accion == "editar") {
          this.lunesHorario = this.jornadaVieja.dias['lunes'];
          this.martesHorario = this.jornadaVieja.dias['martes'];
          this.miercolesHorario = this.jornadaVieja.dias['miercoles'];
          this.juevesHorario = this.jornadaVieja.dias['jueves'];
          this.viernesHorario = this.jornadaVieja.dias['viernes'];
          this.sabadoHorario = this.jornadaVieja.dias['sabado'];
          console.log(this.lunesHorario);
        }
        this.cronograma = res;
      });
    })
  }
    

  toggleActive(hora: HorarioCronograma) {
    hora.disponible = !hora.disponible;
  }

  filtrarTomados() {
    this.lunes = this.filtrar(this.lunes);
    this.martes = this.filtrar(this.martes);
    this.miercoles = this.filtrar(this.miercoles);
    this.jueves = this.filtrar(this.jueves);
    this.viernes = this.filtrar(this.viernes);
    this.sabado = this.filtrar(this.sabado);
  }


  filtrar(dia: JornadaDiaView) {
    const nuevo = {} as JornadaDiaView;

    for (const consultorio in dia) {
      nuevo[consultorio] = dia[consultorio].filter((hora: HorarioCronograma) => hora.disponible);
    }

    return nuevo;
  }


  borrarHorario(dia: string, hora: Horario): void {
    // Filtrar el horario de la jornada vieja
    const horario = this.jornadaVieja.dias[dia].find((h: Horario) => h.hora === hora.hora);
    if (horario) {
        this.jornadaVieja.dias[dia] = this.jornadaVieja.dias[dia].filter((h: Horario) => h !== horario);
        this.jor.updateJornada(this.jornadaVieja);
    }

    // Asegurarse de que this.cronograma tiene el consultorio correcto
    if (this.cronograma) {
        for (const consultorio in this.cronograma) {
            if (this.cronograma.hasOwnProperty(consultorio)) {
                const horariosCronograma = this.cronograma[consultorio][dia];
                if (Array.isArray(horariosCronograma)) {
                    horariosCronograma.forEach((h: HorarioCronograma) => {
                        if (h.hora === hora.hora) {
                            h.disponible = true;
                        }
                    });
                } else {
                    console.error(`Expected this.cronograma[${consultorio}][${dia}] to be an array, but got:`, horariosCronograma);
                }
            }
        }

        // Verificar que this.cronograma no contiene propiedades undefined
        const cleanedCronograma = JSON.parse(JSON.stringify(this.cronograma));
        this.jor.updateCronograma(cleanedCronograma);
    } else {
        console.error("this.cronograma is undefined");
    }
  }

  guardar() {
    this.lunesHorario = [];
    this.martesHorario = [];
    this.miercolesHorario = [];
    this.juevesHorario = [];
    this.viernesHorario = [];
    this.sabadoHorario = [];
  
    this.generarJornada(this.lunes, this.lunesHorario);
    this.generarJornada(this.martes, this.martesHorario);
    this.generarJornada(this.miercoles, this.miercolesHorario);
    this.generarJornada(this.jueves, this.juevesHorario);
    this.generarJornada(this.viernes, this.viernesHorario);
    this.generarJornada(this.sabado, this.sabadoHorario);
  
    this.diasEsp = {
      lunes: this.lunesHorario,
      martes: this.martesHorario,
      miercoles: this.miercolesHorario,
      jueves: this.juevesHorario,
      viernes: this.viernesHorario,
      sabado: this.sabadoHorario,
    };
  
    this.jornadaEsp = {
      email: this.email,
      dias: this.diasEsp,
      id: '',
    };
  
    if (esJornadaValida(this.jornadaEsp)) {
      const crono = convertirJornadaACronograma(this.jornadaEsp);
      this.cronograma = this.jor.actualizarCronograma(this.cronograma, crono);
  
      this.jor.updateCronograma(this.cronograma);
  
      if (this.jornadaVieja) {
        this.jornadaEsp.id = this.jornadaVieja.id;
        for (const dia in this.jornadaVieja.dias) {
          for (const horarios of this.jornadaVieja.dias[dia]) {
            this.jornadaEsp.dias[dia] = this.jornadaEsp.dias[dia].concat(horarios);
            this.ordenarPorHora(this.jornadaEsp.dias[dia]);
          }
        }
        this.jor.updateJornada(this.jornadaEsp);
        console.log(this.jornadaEsp.dias);
  
      } else {
        this.jor.agregarJornada(this.jornadaEsp);
      }
  
    } else {
      console.log("No es valida");
    }
  }


  generarJornada(dia: JornadaDiaView, horario: Horario[]) {
    for (const consult in dia) {
      for (const hora in dia[consult]) {
        if (!dia[consult][hora]['disponible']) {
          horario.push({
            hora: dia[consult][hora]['hora'],
            nroConsultorio: parseInt(consult[consult.length - 1])
          });
        }
      }
    }
  }

  ordenarPorHora(horarios: Horario[]) {
    horarios.sort((a: Horario, b: Horario) => {
      // Convertir las horas a objetos Date para comparar
      const horaA = new Date(`1970-01-01T${a.hora}`);
      const horaB = new Date(`1970-01-01T${b.hora}`);

      // Comparar las horas
      return horaA.getTime() - horaB.getTime();
    });
  }
}
