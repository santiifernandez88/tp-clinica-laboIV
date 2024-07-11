import { Injectable } from '@angular/core';
import { Paciente } from '../interfaces/paciente';
import { Firestore, addDoc, collection, collectionData, doc, getDocs, onSnapshot, query, setDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private dataRef = collection(this.firestore, 'pacientes');

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


  traer(): Observable<Paciente[]> {
    return new Observable<Paciente[]>((observer) => {
      onSnapshot(collection(this.firestore, 'pacientes'), (snap) => {
        const pacientes: Paciente[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data() as Paciente;
          pacientes.push(one);
        });
        observer.next(pacientes);
      });
    });
  }

traerPacientePorId(idPac: number): Observable<Paciente> {
    return new Observable<Paciente>((observer) => {
      onSnapshot(this.dataRef, (snap) => {
        snap.docChanges().forEach(x => {
          const data = x.doc.data() as Paciente;
          if (data.dni === idPac) {
            observer.next(data);
          }
        });
      });
    });
  }


  traerPacientePorMail(mail: string): Observable<Paciente | null> {
    return new Observable<Paciente | null>((observer) => {
      const q = query(this.dataRef, where('mail', '==', mail));
      getDocs(q).then(snapshot => {
        if (snapshot.empty) {
          observer.next(null);
        } else {
          const data = snapshot.docs[0].data() as Paciente;
          observer.next(data);
        }
      }).catch(error => {
        console.error("Error al traer el paciente por mail: ", error);
        observer.error(error);
      });
    });
  }

}
