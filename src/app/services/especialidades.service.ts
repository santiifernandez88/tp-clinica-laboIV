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

  getEspecialidad(especialidad: string): Observable<string | null> {
    return new Observable<string | null>((observer) => {
      const q = query(this.dataRef, where('nombre', '==', especialidad));
      const unsubscribe = onSnapshot(q, (snap) => {
        let found = false;
        snap.forEach(doc => {
          const data = doc.data() as any;
          if (data.nombre === especialidad) {
            found = true;
            observer.next(data.nombre);
          }
        });
        if (!found) {
          observer.next(null);
        }
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
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
}
