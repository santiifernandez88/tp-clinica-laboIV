import { Component, OnInit } from '@angular/core';
import { Paciente } from '../../../interfaces/paciente';
import { PacienteService } from '../../../services/paciente.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DatoDinamico, HistoriaClinica } from '../../../interfaces/historiaClinica';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Especialista } from '../../../interfaces/especialista';
import { TurnoService } from '../../../services/turno.service';
import { Turno } from '../../../interfaces/turno';
import { EspecialistaService } from '../../../services/especialista.service';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from "../../../pipes/capitalize.pipe";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CapitalizePipe],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  
  paciente!: Paciente;
  public historialClinico: HistoriaClinica[] = [];
  public especialistas: Especialista[] = [];
  public turnosHist : Turno[] = [];
  public mostrarHis: boolean | undefined = undefined;
  public especialidadSeleccionada: string = ''; // Nuevo campo para almacenar la especialidad seleccionada
  logoBase64: string = ''; // Variable para almacenar el dataURL del logo

  constructor(private pacienteService: PacienteService, private userService: UserService, private tur: TurnoService, private espServ: EspecialistaService) {}
  
  async ngOnInit(){
    this.pacienteService.obtenerPacientes().subscribe(respuesta => {
      respuesta.forEach((pac: Paciente) => {
        if (this.userService.currentUser.mail === pac.mail) {
          this.paciente = {
            nombre: pac.nombre,
            apellido: pac.apellido,
            edad: pac.edad,
            dni: pac.dni,
            obraSocial: pac.obraSocial,
            mail: pac.mail,
            password: pac.password,
            fotoPerfilUno: pac.fotoPerfilUno,
            fotoPerfilDos: pac.fotoPerfilDos,
          };
          return;
        }
      });
    });
    this.espServ.obtenerEspecialistas().subscribe(esp => {
      this.especialistas = esp;
    });
    
  }
  
  sacarKey(datos: DatoDinamico) {
    return Object.keys(datos)[0];
  }

  getEspecialista(email: string): string {
    for (const esp of this.especialistas) {
      if (esp.mail === email) {
        return `${esp.nombre} ${esp.apellido}`;
      }
    }
    return '';
  }

  getHistorial(paciente: Paciente) {
    this.tur.traerTurnosByEmailPaciente(paciente.mail).subscribe(turHis => {
      this.turnosHist = turHis.filter(his => his.historial?.pacienteEmail === paciente.mail);
      if (this.turnosHist.length <= 0) {
        this.mostrarHis = false;
      } else {
        this.mostrarHis = true;
      }
    });
  }

  downloadPDF() {
    if (this.especialidadSeleccionada) {
      const documentDefinition: any = this.getDocumentDefinitionByEspecialidad(this.especialidadSeleccionada);
      pdfMake.createPdf(documentDefinition).download(`Historial_Clinico_${this.paciente.nombre}_${this.paciente.apellido}_${this.especialidadSeleccionada}.pdf`);
    } else {
      const documentDefinition: any = this.getDocumentDefinition();
      pdfMake.createPdf(documentDefinition).download(`Historial_Clinico_${this.paciente.nombre}_${this.paciente.apellido}.pdf`);
    }
  }

  getDocumentDefinition() {
    const fechaEmision = new Date().toLocaleDateString();
   
    return {
      content: [
        {
          image: 'logo',
          width: 150,
          height:150,
          alignment: 'center',
        },
        { text: 'Informe de Turnos', style: 'header', alignment: 'center' },
        { text: `Fecha de emisión: ${fechaEmision}`, style: 'subheader', alignment: 'center' },
        ...this.turnosHist.map(turno => {
          return [
            { text: `Especialista: ${this.getEspecialista(turno.especialistaEmail)}`, style: 'subheader' },
            { text: `Especialidad: ${turno.especialidad}` },
            { text: `Fecha: ${turno.fecha} ${turno.horario.hora}` },
            { text: `Altura: ${turno.historial?.altura}` },
            { text: `Peso: ${turno.historial?.peso}` },
            { text: `Temperatura: ${turno.historial?.temperatura}` },
            { text: `Presión: ${turno.historial?.presion}` },
            ...turno.historial?.datos.map((dato: any) => ({ text: `${dato.clave}: ${dato.valor}` })) || [],
            { text: '', margin: [0, 10] }
          ];
        })
      ],
      images: {
        logo: "https://i.ibb.co/rcwVY3D/clinica.png"
      },
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 20, 0, 10]
        },
        subheader: {
          fontSize: 18,
          bold: true,
          margin: [0, 15, 0, 5]
        },
        table: {
          margin: [0, 5, 0, 15]
        }
      },
      
    };
  }

  getDocumentDefinitionByEspecialidad(especialidad: string) {
    const fechaEmision = new Date().toLocaleDateString();
    const filteredTurnos = this.turnosHist.filter(turno => turno.especialidad === especialidad);

    return {
      content: [
        {
          image: 'logo',
          width: 150,
          height:150,
          alignment: 'center',
        },
        { text: `Informe de Turnos por Especialidad: ${especialidad}`, style: 'header', alignment: 'center' },
        { text: `Fecha de emisión: ${fechaEmision}`, style: 'subheader', alignment: 'center' },
        ...filteredTurnos.map(turno => {
          return [
            { text: `Especialista: ${this.getEspecialista(turno.especialistaEmail)}`, style: 'subheader' },
            { text: `Especialidad: ${turno.especialidad}` },
            { text: `Fecha: ${turno.fecha} ${turno.horario.hora}` },
            { text: `Altura: ${turno.historial?.altura}` },
            { text: `Peso: ${turno.historial?.peso}` },
            { text: `Temperatura: ${turno.historial?.temperatura}` },
            { text: `Presión: ${turno.historial?.presion}` },
            ...turno.historial?.datos.map((dato: any) => ({ text: `${dato.clave}: ${dato.valor}` })) || [],
            { text: '', margin: [0, 10] }
          ];
        })
      ],
      images: {
        logo: "https://i.ibb.co/rcwVY3D/clinica.png"
      },
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 20, 0, 10]
        },
        subheader: {
          fontSize: 18,
          bold: true,
          margin: [0, 15, 0, 5]
        },
        table: {
          margin: [0, 5, 0, 15]
        },
      }
    };
  }

  especialidadesDisponibles() {
    const especialidades = this.turnosHist.map(turno => turno.especialidad);
    return especialidades.filter((value, index, self) => self.indexOf(value) === index);
  }
}
