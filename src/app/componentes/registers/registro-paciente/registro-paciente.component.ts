import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ImagenService } from '../../../services/imagen.service';
import { Paciente } from '../../../interfaces/paciente';
import { PacienteService } from '../../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css'
})
export class RegistroPacienteComponent {

  formulario!: FormGroup;
  private paciente: Paciente | undefined;
  private file1: any;
  private file2: any;
  public captcha: string = '';
  public msjError: string = '';
  public msjExito!: string;
  public loading : boolean = false;
  obrasSociales: string[] = ['OSDE', 'IOMA', 'SWISS MEDICAL']; // Ejemplo de obras sociales


  constructor(private auth: AuthService, private imagenService: ImagenService, private pacienteService : PacienteService){}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.pattern('^[a-zA-Z]+$'), Validators.required]),
      apellido: new FormControl('', [Validators.pattern('^[a-zA-Z]+$'), Validators.required]), // Fixed regex for letters
      dni: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.minLength(6), Validators.maxLength(9)]),
      edad: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.max(99), Validators.required]),
      mail: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required]),
      fotoPerfilUno: new FormControl('', [Validators.required]),
      fotoPerfilDos: new FormControl('', [Validators.required]),
      obraSocial: new FormControl('', [Validators.required]), // Fixed validator
    });
  }

  isValidField(field: string): boolean | null {
    const control = this.formulario.get(field);
    return control?.errors && control?.touched || null;
  }

  getFieldError(field: string): string | null {
    const control = this.formulario.get(field);
    if (!control || !control.errors) return null;

    const errors = control.errors;
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return "Este campo es requerido";
        case 'minlength':
          return `Minimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Maximo ${errors['maxlength'].requiredLength} caracteres.`;
        case 'min':
          return `Como minimo debe ser ${errors['min'].min}.`;
        case 'max':
          return `Como maximo debe ser ${errors['max'].max}.`;
        case 'pattern':
          return "Formato inválido";
        case 'email':
          return "Email invalido";
      }
    }
    return null;
  }

  async crearPaciente(){
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      console.log("invalid form");
      return;
    }

    this.loading = true;
    console.log(this.formulario.value);
    this.paciente = this.formulario.value;
    const { nombre, apellido, dni, edad, mail, password, fotoPerfilUno, fotoPerfilDos, obraSocial } = this.formulario.value;
    this.paciente =
      {
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        dni: dni,
        obraSocial: obraSocial,
        mail: mail,
        password: password,
        fotoPerfilUno: fotoPerfilUno,
        fotoPerfilDos: fotoPerfilDos,
  
      } ;

      this.auth.Register(this.paciente.mail, this.paciente.password).then(res => {
        if (res == null) {
          // Manejar error de registro aquí
        } else {
          this.registrarPaciente();
        }  
      }).catch(error => {
        console.error('Error during registration', error);
        
        switch(error.code) {
          case 'auth/email-already-in-use':
            this.msjError = "El email esta en uso";
            break;
        }
        this.loading = false; // Terminar carga
      });;
  }

  async registrarPaciente() {
    const path1 = await this.imagenService.subirImg(this.file1);
    this.paciente!.fotoPerfilUno = path1;
    const path2 = await this.imagenService.subirImg(this.file2);
    this.paciente!.fotoPerfilDos = path2;
    const res = await this.pacienteService.agregarPaciente(this.paciente!)
    console.log(res);
    this.msjExito = "Paciente creado con exito!!";
    this.loading = false;
    setTimeout(() => {
      this.auth.logout()
      this.formulario.reset();
    }, 3000);
  }

  uploadImageUno(foto: any) {
    this.file1 = foto.target.files[0];
  }

  uploadImageDos(foto: any) {
    this.file2 = foto.target.files[0];
  }
}
