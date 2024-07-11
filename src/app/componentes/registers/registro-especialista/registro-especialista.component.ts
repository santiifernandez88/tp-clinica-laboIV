import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablaEspecialidadesComponent } from '../../layouts/tabla-especialidades/tabla-especialidades.component';
import { AuthService } from '../../../services/auth.service';
import { Especialista } from '../../../interfaces/especialista';
import { ImagenService } from '../../../services/imagen.service';
import { EspecialistaService } from '../../../services/especialista.service';
import { RouterLink } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, TablaEspecialidadesComponent, RouterLink, RecaptchaModule],
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.css'] // Fixed 'styleUrl' to 'styleUrls'
})
export class RegistroEspecialistaComponent implements OnInit {

  formulario!: FormGroup;
  private especialista: Especialista | undefined;
  private file: any;
  public msjError: string = '';
  public msjExito!: string;
  public loading: boolean = false;
  public captcha: string = '';
  public showCaptchaError : boolean = false;

  constructor(private auth: AuthService, private imagenService: ImagenService, private especialistaService: EspecialistaService) { }

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.pattern('^[a-zA-Z]+$'), Validators.required]),
      apellido: new FormControl('', [Validators.pattern('^[a-zA-Z]+$'), Validators.required]), // Fixed regex for letters
      dni: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.minLength(6), Validators.maxLength(9)]),
      edad: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(18), Validators.max(99), Validators.required]),
      mail: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required]),
      fotoPerfil: new FormControl('', [Validators.required]),
      especialidades: new FormArray([], [Validators.required]), // Fixed validator
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

  crearEspecialista() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.showCaptchaError = true;
      console.log("invalid form");
      return;
    }

    if(this.captcha){
      this.loading = true;
      console.log(this.formulario.value);
      this.especialista = this.formulario.value;
      const { nombre, apellido, dni, edad, mail, password, fotoPerfil, especialidades } = this.formulario.value;
      this.especialista =
      {
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        dni: dni,
        especialidades: especialidades,
        mail: mail,
        password: password,
        fotoPerfil: fotoPerfil,
        habilitado: false
      };
  
      this.auth.Register(this.especialista.mail, this.especialista.password).then(res => {
        if (res == null) {
          // Manejar error de registro aquí
        } else {
          if (this.file && this.file.name) {
            this.imagenService.subirImg(this.file).then(path => {
              this.especialista!.fotoPerfil = path;
              this.especialistaService.agregarEspecialista(this.especialista!).then(() => {
                this.msjExito = "Especialista creado con exito!!";
                this.loading = false;
                setTimeout(() => {
                  this.auth.logout()
                  this.formulario.reset();
                }, 3000);
  
  
              });
            });
          } else {
            console.error('File is undefined or null');
            this.loading = false; // Terminar carga
          }
        }
      }).catch(error => {
        console.error('Error during registration', error);
  
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.msjError = "El email esta en uso";
            break;
        }
        this.loading = false; // Terminar carga
      });;
    }else{
      this.showCaptchaError = true;
      this.msjError = "Tienes que verificar que no eres un robot";
    }
  }

  getEspecialidad(especialidad: string[]) {
    const especialidadesFormArray = this.formulario.get('especialidades') as FormArray;

    // Limpiar el FormArray antes de agregar las nuevas especialidades seleccionadas
    while (especialidadesFormArray.length) {
      especialidadesFormArray.removeAt(0);
    }

    // Agrega cada especialidad al FormArray
    especialidad.forEach(especialidad => {
      especialidadesFormArray.push(new FormControl(especialidad, [Validators.required]));
      console.log(especialidadesFormArray);
    });
  }

  uploadImage(foto: any) {
    this.file = foto.target.files[0];
    //console.log(this.file);
  }

  resolved(captchaResponse: any) {
    this.captcha = captchaResponse;
    this.showCaptchaError = false;
  }
}
