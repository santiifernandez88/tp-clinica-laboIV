import { Injectable } from '@angular/core';
import { Admin } from '../interfaces/admin';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: Firestore) { }

  async agregarAdmin(admin: Admin) {
    try {
      const adminRef = doc(this.firestore, `administradores/${admin.dni}`);
      await setDoc(adminRef, admin);
    } catch (error) {
      console.error("Error al agregar al administrador: ", error);
    }
  }

  obtenerAdministradores(): Observable<[]>{
    const administradores = collection(this.firestore, 'administradores')
    return collectionData(administradores) as Observable<[]>
  }
}
