import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Turno } from '../../../interfaces/turno';
import { AuthService } from '../../../services/auth.service';
import { TurnoService } from '../../../services/turno.service';
import { EspecialistaService } from '../../../services/especialista.service';
import { Especialista } from '../../../interfaces/especialista';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EstadoTurnoDirective } from '../../../directivas/estado-turno.directive';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CommonModule, RouterLink, EstadoTurnoDirective],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent {

  public email!: string;
  public turnos: Turno[] = [];
  public turnosMostrar: Turno[] = [];
  public especialistas: Especialista[] = [];

  constructor(
    private userService: UserService,
    private tur: TurnoService,
    private esp: EspecialistaService
  ) { }

  ngOnInit(): void {
   
    this.email = this.userService.currentUser.mail;
    this.traerTurnos();   
  }

  traerTurnos() {
    this.tur.traerTurnosByEmailPaciente(this.email).subscribe((turnos) => {
      this.turnos = turnos;
      this.turnosMostrar = turnos;
      for (const item of this.turnos) {
        this.esp.traerPorEmail(item.especialistaEmail).subscribe((res) => {
          let existe = false;
          if (this.especialistas.length == 0) {
            this.especialistas.push(res);
          } else {
            for (const especialista of this.especialistas) {
              if (especialista.mail === res.mail) {
                existe = true;
                break;
              }
            }
            if (!existe) {
              this.especialistas.push(res);
            }
          }
        });
      }
    });
  }

  verResenia(turno: Turno) {
    if (turno.reseña) {
      Swal.fire(turno.reseña);
    } else {
      Swal.fire('No hay reseña todavia');
    }
  }

  getResenia(turno: Turno): string {
    return turno.reseña;
  }

  async completarEncuesta(turno: Turno) {

    const { value: formValues } = await Swal.fire({
      title: "Encuesta del servicio",
      html: `
      <label for="swal-input1">1. ¿Cómo calificarías la amabilidad del personal en tu última visita a nuestra clínica?</label>
<input id="swal-input1" class="swal2-input">

<label for="swal-input2">2. En una escala del 1 al 10, ¿qué tan satisfecho estás con la claridad de las explicaciones proporcionadas por nuestro personal médico sobre tu condición de salud y el plan de tratamiento?</label>
<input id="swal-input2" class="swal2-input" type="number" min="1" max="10">

<label for="swal-input3">3. ¿Consideras que el tiempo de espera en la clínica fue razonable en tu última visita?</label>
<input id="swal-input3" class="swal2-input" type="text">

      `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById("swal-input1") as HTMLInputElement).value,
          (document.getElementById("swal-input2") as HTMLInputElement).value,
          (document.getElementById("swal-input3") as HTMLInputElement).value,
        ];
      }
    });
    if (formValues) {
      Swal.fire({
        title: "Encuesta completada!",
        text: `Gracias por completar nuestra encuensta`,
        icon: "success",
      }).then(() => {
        console.log(formValues);
        turno.encuesta = formValues;
        this.tur.updateTurno(turno);
        this.traerTurnos();
      });
    }

  }

  async calificar(turno: Turno) {
    const { value: rating } = await Swal.fire({
      title: "Calificar Atencion",
      html: `
          <label for="swal-input2">En una escala del 1 al 10, ¿qué calificacion le das al turno?</label>
          <input id="swal-input2" class="swal2-input" type="number" min="1" max="10">
      `
      ,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById("swal-input2") as HTMLInputElement).value,
        ];
      }
    });
  
    if (rating) {
      Swal.fire({
        title: "Calificado!",
        text: `Gracias por calificar nuestro personal`,
        icon: "success",
      }).then(() => {
        turno.calificacion = Number(rating);
        this.tur.updateTurno(turno);
        this.traerTurnos();
      });
    }
  }
  
  

  async cancelar(turno: Turno) {
    Swal.fire({
      title: "Cancelar Turno?",
      text: "No podras revertirlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#339933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancelar Turno"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: text } = await Swal.fire({
          input: "textarea",
          inputLabel: "Cancelar el Turno",
          inputPlaceholder: "Ingrese la razon por la cual quiere cancelar el turno",
          inputAttributes: {
            "aria-label": "Type your message here"
          },
          showCancelButton: true
        });
        if (text) {
          Swal.fire({
            title: "Cancelado!",
            text: `El turno fue cancelado con exito`,
            icon: "error"
          }).then(() => {
            turno.reseña = text;
            turno.estado = "cancelado";
            this.tur.updateTurno(turno);
            this.traerTurnos();
          });
        }

      }
    });
  }

  getEspecialista(email: string): string {
    let nombre = '';
    for (const esp of this.especialistas) {
      if (esp.mail === email) {
        nombre = `${esp.nombre} ${esp.apellido}`;
        break;
      }
    }
    return nombre;
  }

  contieneSubcadenaIgnoreCase(cadenaPrincipal: string, subcadena: string): boolean {
    return cadenaPrincipal.toLowerCase().includes(subcadena.toLowerCase());
  }

  getFiltro(event: any) {
    const valor = event.target.value;

    if (valor === '') {
      this.turnosMostrar = this.turnos;
    } else {
      this.turnosMostrar = this.turnos.filter(turno => 
        this.contieneSubcadenaIgnoreCase(turno.estado, valor) ||
        this.contieneSubcadenaIgnoreCase(turno.fecha, valor) ||
        this.contieneSubcadenaIgnoreCase(turno.especialidad, valor) ||
        this.contieneSubcadenaIgnoreCase(turno.horario.hora, valor) ||
        this.contieneSubcadenaIgnoreCase(this.getEspecialista(turno.especialistaEmail), valor) ||
        (turno.historial && 
          (this.contieneSubcadenaIgnoreCase(turno.historial.altura, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.historial.peso, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.historial.presion, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.historial.temperatura, valor) ||
          turno.historial.datos.some(dato => 
            this.contieneSubcadenaIgnoreCase(dato['clave'], valor) || 
            this.contieneSubcadenaIgnoreCase(dato['valor'], valor)
          ))
        )
      );
    }
  }
}
