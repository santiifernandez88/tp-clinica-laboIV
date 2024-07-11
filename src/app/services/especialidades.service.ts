import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, doc, onSnapshot, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Especialidades } from '../interfaces/especialidades';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  private dataRef = collection(this.firestore, 'especialidades');

  constructor(private firestore: Firestore) { }

  crearEspecialidad(especialidad: string) {
    return addDoc(this.dataRef, { 'nombre': especialidad });
  }

  getEspecialidad(especialidad: string): Observable<Especialidades | null> {
    const q = query(this.dataRef, where('nombre', '==', especialidad));
    return new Observable<Especialidades | null>((observer) => {
      getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data() as Especialidades;
          observer.next(data);
        } else {
          observer.next(null);
        }
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  getAllEspecialidades(): Observable<Especialidades[]> {
    return new Observable<Especialidades[]>((observer) => {
      getDocs(this.dataRef).then((querySnapshot) => {
        const especialidades: Especialidades[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Especialidades;
          especialidades.push(data);
        });
        observer.next(especialidades);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  getEspecialidadesPorEspecialista(email: string): Observable<Especialidades[]> {
    return new Observable<Especialidades[]>((observer) => {
      const q = query(this.dataRef, where('especialistaEmail', '==', email));
      getDocs(q).then((querySnapshot) => {
        const especialidades: Especialidades[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Especialidades;
          especialidades.push(data);
        });
        observer.next(especialidades);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
