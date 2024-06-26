import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, limit, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Especialista } from '../interfaces/especialista';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  private dataRef = collection(this.firestore, 'especialistas');

  constructor(private firestore: Firestore) { }

  async agregarEspecialista(especialista: Especialista) {
    try {
      const especialistaRef = doc(this.firestore, `especialistas/${especialista.dni}`);
      await setDoc(especialistaRef, especialista);
    } catch (error) {
      console.error("Error al agregar el especialista: ", error);
    }
  }

  obtenerEspecialistas(): Observable<[]>{
    const especialistas = collection(this.firestore, 'especialistas')
    return collectionData(especialistas) as Observable<[]>
  }

  updateEspecialista(especialista: Especialista): void {
    const docs = doc(this.firestore, `especialistas/${especialista.dni}`);
    updateDoc(docs, { habilitado: especialista.habilitado });
  }

 

}
