import { Injectable } from '@angular/core';
import { Paciente } from '../interfaces/paciente';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private firestore : Firestore) { }

  async agregarPaciente(paciente: Paciente) {
    try {
      const pacienteRef = doc(this.firestore, `pacientes/${paciente.dni}`);
      await setDoc(pacienteRef, paciente);
    } catch (error) {
      console.error("Error al agregar el paciente: ", error);
    }
  }

  obtenerPacientes(): Observable<[]>{
    const pacientes = collection(this.firestore, 'pacientes')
    return collectionData(pacientes) as Observable<[]>
  }
}
