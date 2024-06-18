import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ImagenService } from '../../../services/imagen.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Admin } from '../../../interfaces/admin';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro-admin.component.html',
  styleUrl: './registro-admin.component.css'
})
export class RegistroAdminComponent {
  private file: any
  private admin!: Admin;
  public formulario!: FormGroup;
  public msjError: string = '';
  public msjExito!: string;
  public loading : boolean = false;

  constructor(private auth: AuthService, private imgService: ImagenService, private admService: AdminService) { }

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.pattern('^[a-zA-Z]+$'), Validators.required]),
      apellido: new FormControl('', [Validators.pattern('^[a-zA-Z]+$'), Validators.required]), // Fixed regex for letters
      dni: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.minLength(6), Validators.maxLength(9)]),
      edad: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(18), Validators.max(99), Validators.required]),
      mail: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required]),
      fotoPerfil: new FormControl('', [Validators.required]),
    });

  }
  uploadImage(foto: any) {
    this.file = foto.target.files[0];
  }

  isValidField(field: string): boolean | null {
    return this.formulario.controls[field].errors && this.formulario.controls[field].touched
  }

  getFieldError(field: string): string | null {
    if (!this.formulario.controls[field] && !this.formulario.controls[field].errors) return null;

    const errors = this.formulario.controls[field].errors;
    for (const key of Object.keys(errors!)) {
      switch (key) {
        case 'required':
          return "Este campo es requerido"
        case 'requiredTrue':
          return "Debe aceptar los terminos y condiciones"
        case 'minlength':
          return `Minimo ${errors!['minlength'].requiredLength} caracteres.`
        case 'maxlength':
          return `Maximo ${errors!['maxlength'].requiredLength} caracteres.`
        case 'min':
          return `Como minimo debe ser ${errors!['min'].min}.`
        case 'max':
          return `Como maximo debe ser ${errors!['max'].max}.`
      }
    }
    return null;
  }

  async crearAdmin() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      console.log("invalid form");
      return;
    }
    this.loading = true;
    this.admin = this.formulario.value;
    const { nombre, apellido, edad, dni, mail, password, img } = this.formulario.value;
    this.admin =
      {
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        dni: dni,
        mail: mail,
        password: password,
        img: img,
      } as Admin;

    this.auth.RegisterAdmin(this.admin.mail, this.admin.password).then(async res => {
      if (!res) {
        
      } else {
        if(this.file && this.file.name){
          this.imgService.subirImg(this.file).then(path => {
            this.admin!.img = path;
            this.admService.agregarAdmin(this.admin!).then(() => {
              this.msjExito = "Admin creado con exito!!";
              this.loading = false;
              setTimeout(() => {
                this.formulario.reset();
              }, 3000);
                  
            });;
          });
        } else{
          console.error('File is undefined or null');
          this.loading = false; // Terminar carga
        }
          
      }
    }).catch(error => {
      console.error('Error during registration', error);
      
      switch(error.code) {
        case 'auth/email-already-in-use':
          this.msjError = "El email esta en uso";
          break;
      }
      this.loading = false; // Terminar carga
    });
  }

}
