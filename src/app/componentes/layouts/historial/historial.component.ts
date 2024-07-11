import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paciente } from '../../../interfaces/paciente';
import { PacienteService } from '../../../services/paciente.service';
import { UserService } from '../../../services/user.service';
import { TurnoService } from '../../../services/turno.service';
import { HistoriaClinica } from '../../../interfaces/historiaClinica';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class HistorialComponent {

  @Output() public turnoHistorial = new EventEmitter<boolean>();
  public form: FormGroup;
  public idPaciente!: number;
  public espEmail!: string;
  public historial!: HistoriaClinica;
  public paciente!: Paciente;

  constructor(private fb: FormBuilder, private pac: PacienteService, private cUser: UserService, private turn: TurnoService) {
    this.form = this.fb.group({
      altura: ['', [Validators.required, Validators.min(1), Validators.max(300)]],
      peso: ['', [Validators.required, Validators.min(1), Validators.max(270)]],
      temperatura: ['', [Validators.required, Validators.min(30), Validators.max(50)]],
      presion: ['', [Validators.required, Validators.min(80), Validators.max(130)]],
      datos: this.fb.array([], Validators.required),
      clave: [''], // Control temporal para clave
      valor: ['']  // Control temporal para valor
    });
  }

  ngOnInit(): void {
    this.espEmail = this.cUser.currentUser.mail;
    this.idPaciente = this.cUser.idPacienteHistorial;
    this.pac.traerPacientePorId(this.idPaciente).subscribe(paciente => this.paciente = paciente);
  }

  get datos() {
    return this.form.get('datos') as FormArray;
  }

  isValidField(field: string): boolean | null {
    return this.form.controls[field].errors && this.form.controls[field].touched;
  }

  getFieldError(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.errors) return null;

    const errors = control.errors;

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return "Este campo es requerido";
        case 'min':
          return `El valor mínimo permitido es ${errors['min'].min}`;
        case 'max':
          return `El valor máximo permitido es ${errors['max'].max}`;
      }
    }
    return null;
  }

  onDeleteDatos(i: number): void {
    this.datos.removeAt(i);
  }

  onAddDatos(): void {
    if (this.form.get('clave')!.invalid || this.form.get('valor')!.invalid) return;

    const nuevoDato = this.fb.group({
      clave: [this.form.get('clave')!.value],
      valor: [this.form.get('valor')!.value]
    });

    this.datos.push(nuevoDato);

    this.form.get('clave')!.reset();
    this.form.get('valor')!.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log("estoy aca");
    const datosArray = this.datos.controls.map(control => ({
      clave: control.get('clave')?.value,
      valor: control.get('valor')?.value
    }));

    this.historial = {
      altura: this.form.value['altura'],
      peso: this.form.value['peso'],
      temperatura: this.form.value['temperatura'],
      presion: this.form.value['presion'],
      datos: datosArray,
      especialsitaEmail: this.espEmail,
      pacienteEmail: this.paciente.mail,
    };
    console.log(this.historial);
    // Limpiar el formulario y el array de datos
    this.datos.clear();
    this.form.reset();
    this.form.get('clave')!.setValidators([Validators.required]);
    this.form.get('valor')!.setValidators([Validators.required]);

    // Actualizar el turno y emitir evento
    this.cUser.turno.historial = this.historial;
    this.turn.updateTurno(this.cUser.turno);
    this.turnoHistorial.emit(false);
  }

  cancel() {
    this.turnoHistorial.emit(false);
  }
}
