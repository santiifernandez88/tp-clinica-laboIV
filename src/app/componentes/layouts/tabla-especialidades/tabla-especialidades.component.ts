import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { EspecialidadesService } from '../../../services/especialidades.service';
import { Subscription } from 'rxjs';
import { Especialidades } from '../../../interfaces/especialidades';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-tabla-especialidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-especialidades.component.html',
  styleUrls: ['./tabla-especialidades.component.css'],
  animations: [
    trigger('sliderInFromBottom', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class TablaEspecialidadesComponent implements OnInit {

  public especialidades: Especialidades[] = [];
  public rowsClicked: number[] = [];
  public error: boolean = false;
  @Output() especialidadSeleccionado = new EventEmitter<string[]>();
  @ViewChild('especialidadInput') especialidadInput!: ElementRef;
  private subscription: Subscription = new Subscription();

  constructor(private especialidadService: EspecialidadesService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.especialidadService.getAllEspecialidades().subscribe(
        (especialidades) => {
          this.especialidades = especialidades;
        },
        (error) => {
          console.error('Error al obtener las especialidades:', error);
          this.error = true;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClickRow(obra: Especialidades, idx: number) {
    if (this.rowsClicked.includes(idx)) {
      this.rowsClicked.splice(this.rowsClicked.indexOf(idx), 1);
    } else {
      this.rowsClicked.push(idx);
    }
    const selectedEspecialidades = this.rowsClicked.map(i => this.especialidades[i].nombre);
    this.especialidadSeleccionado.emit(selectedEspecialidades);
    console.log("Especialidades seleccionadas: ", selectedEspecialidades);
    console.log("Row indices seleccionados: ", this.rowsClicked);
  }

  agregarEspecialidad() {
    const especialidad = this.especialidadInput.nativeElement.value;
    const nuevaEspecialidad = this.quitarAcentos(especialidad);
    this.error = false;
    const esp: Especialidades = { nombre: nuevaEspecialidad, fotoPerfil: '' };

    this.especialidades.forEach((e) => {
      let especialidadSinAcentos = this.quitarAcentos(e.nombre);
      if (especialidadSinAcentos.toLowerCase() === esp.nombre.toLowerCase()) {
        this.error = true;
        return;
      }
    });

    if (!this.error && nuevaEspecialidad !== "") {
      this.especialidades.push(esp);
      this.especialidadInput.nativeElement.value = '';

      this.especialidadService.crearEspecialidad(esp.nombre).then(() => {
        console.log('Especialidad agregada exitosamente:', esp);
      }).catch((error) => {
        console.error('Error al agregar especialidad:', error);
      });
    }
  }

  quitarAcentos(texto: string): string {
    if (typeof texto !== 'string') {
      texto = String(texto);
    }
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}
