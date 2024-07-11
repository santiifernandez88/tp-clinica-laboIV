import { Injectable } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection, doc, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
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


  obtenerCantidadTurnosPorEspecialidad(): Observable<{ especialidad: string, cantidad: number }[]> {
    return new Observable<{ especialidad: string, cantidad: number }[]>((observer) => {
      onSnapshot(this.turnRef, (snap) => {
        const especialidades: { [key: string]: number } = {};

        snap.docChanges().forEach(x => {
          const data = x.doc.data() as Turno;
          if (especialidades[data.especialidad]) {
            especialidades[data.especialidad]++;
          } else {
            especialidades[data.especialidad] = 1;
          }
        });

        const resultados: { especialidad: string, cantidad: number }[] = Object.keys(especialidades).map(key => ({
          especialidad: key,
          cantidad: especialidades[key]
        }));

        observer.next(resultados);
      });
    });
  }


  obtenerCantidadTurnosFinalizadosPorMedicoEnTiempo(inicio: string, fin: string): Observable<{ medico: string, cantidad: number }[]> {
    const queryRef = query(this.turnRef,
      where('estado', '==', 'finalizado'),
      where('fecha', '>=', inicio),
      where('fecha', '<=', fin)
    );

    return new Observable<{ medico: string, cantidad: number }[]>((observer) => {
      onSnapshot(queryRef, (snap) => {
        const turnosPorMedico: { [key: string]: number } = {};

        snap.forEach(doc => {
          const data = doc.data() as Turno;
          if (data.especialistaEmail) {
            const medico = data.especialistaEmail;
            turnosPorMedico[medico] = (turnosPorMedico[medico] || 0) + 1;
          }
        });

        const resultados: { medico: string, cantidad: number }[] = Object.keys(turnosPorMedico).map(medico => ({
          medico,
          cantidad: turnosPorMedico[medico]
        }));

        observer.next(resultados);
      });
    });
  }

  
  obtenerCantidadTurnosSolicitadosPorMedico(inicio : string, fin : string): Observable<{ medico: string, cantidad: number }[]> {
    const queryRef = query(this.turnRef,
      where('fecha', '>=', inicio),
      where('fecha', '<=', fin)
    );

    return new Observable<{ medico: string, cantidad: number }[]>((observer) => {
      onSnapshot(queryRef, (snap) => {
        const turnosPorMedico: { [key: string]: number } = {};

        snap.forEach(doc => {
          const data = doc.data() as Turno;
          if (data.especialistaEmail) {
            const medico = data.especialistaEmail;
            turnosPorMedico[medico] = (turnosPorMedico[medico] || 0) + 1;
          }
        });

        const resultados: { medico: string, cantidad: number }[] = Object.keys(turnosPorMedico).map(medico => ({
          medico,
          cantidad: turnosPorMedico[medico]
        }));

        observer.next(resultados);
      });
    });
  }


}
