import { Injectable } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Turno } from '../interfaces/turno';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  private turnRef = collection(this.firestore, 'turnos');

  constructor(private firestore: Firestore) { }

  agregarTurno(nuevaTurno: Turno): void {
    if (nuevaTurno === null) return;
    const docs = doc(this.turnRef);
    nuevaTurno.id = docs.id;
    setDoc(docs, nuevaTurno);
  }

  updateTurno(turno: Turno): void {
    if (turno === null) return;
    const docs = doc(this.turnRef, turno.id);
    updateDoc(docs, { estado: turno.estado, reseña: turno.reseña, calificacion: turno.calificacion, encuesta: turno.encuesta, historial: turno.historial });
  }

  traerTurnos(): Observable<Turno[]> {
    return new Observable<Turno[]>((observer) => {
      onSnapshot(this.turnRef, (snap) => {
        const turnos: Turno[] = [];
        snap.docChanges().forEach(x => {
          const data = x.doc.data() as Turno;
          turnos.push(data);
        });
        observer.next(turnos);
      });
    });
  }

  traerTurnosByEmailPaciente(email: string): Observable<Turno[]> {
    return new Observable<Turno[]>((observer) => {
      onSnapshot(this.turnRef, (snap) => {
        const turnos: Turno[] = [];
        snap.docChanges().forEach(x => {
          const data = x.doc.data() as Turno;
          if (data.pacienteEmail === email) {
            turnos.push(data);
          }
        });
        observer.next(turnos);
      });
    });
  }
  traerTurnosByEmailEspecialista(email: string): Observable<Turno[]> {
    return new Observable<Turno[]>((observer) => {
      onSnapshot(this.turnRef, (snap) => {
        const turnos: Turno[] = [];
        snap.docChanges().forEach(x => {
          const data = x.doc.data() as Turno;
          if (data.especialistaEmail === email) {
            turnos.push(data);
          }
        });
        observer.next(turnos);
      });
    });
  }
}
