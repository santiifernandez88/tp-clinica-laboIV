import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogUsuariosService {

  constructor(private firestore: Firestore) { }

  obtenerLogUsuarios(): Observable<[]>{
    const logsUsuariosRef = collection(this.firestore, 'log-usuarios')
    return collectionData(logsUsuariosRef, {idField:'id'}) as Observable<[]>
  }

  actualizarLogUsuarios(email: string){
    let fecha = formatDate(new Date(), 'yyyy-MM-dd', 'en-US')
    let hora =  formatDate(new Date(), 'HH:mm:ss', 'en-US')
    let log = {"email":email, "fecha":fecha, "hora":hora};
    let logsUsuariosRef = collection(this.firestore, 'log-usuarios');
    addDoc(logsUsuariosRef, log)
  }
}
