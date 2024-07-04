import { Injectable } from '@angular/core';

import { Firestore, addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cronograma, Jornada, JornadaDiaView } from '../interfaces/jornada';

@Injectable({
  providedIn: 'root'
})
export class JornadaService {

  public jornada!: Jornada;

  private espJorRef = collection(this.firestore, 'jornada-especialista');
  private cronoRef = collection(this.firestore, 'cronograma');
  constructor(private firestore: Firestore) { }


  agregarJornada(nuevaJornada: Jornada): void {
    if (nuevaJornada === null) return;
    const docs = doc(this.espJorRef);
    nuevaJornada.id = docs.id;
    setDoc(docs, nuevaJornada)
  }

  updateJornada(jornada: Jornada): void {
    if (jornada === null) return;
    const docs = doc(this.espJorRef, jornada.id);
    updateDoc(docs, { dias: jornada.dias });
  }


  traerJornada(email: string): Observable<Jornada> {
    return new Observable<Jornada>((observer) => {
      onSnapshot(this.espJorRef, (snap) => {
        let jornada!: Jornada;
        snap.docChanges().forEach(x => {
          const data = x.doc.data() as Jornada;
          if (data.email === email) {
            jornada = data;
            return;
          }
        });
        observer.next(jornada);
      });
    });
  }

  traerJornadas(): Observable<Jornada[]> {
    return new Observable<Jornada[]>((observer) => {
      onSnapshot(this.espJorRef, (snap) => {
        let jornada: Jornada[] = [];
        snap.docChanges().forEach(x => {
          const data = x.doc.data() as Jornada;
          //console.log("SOY DATA", data);
          jornada.push(data);
        });
        observer.next(jornada);
      });
    });
  }


  generarJornadaInicial() {

    // es por consultorio
    const horarios = [
      {
        hora: '08:00',
        disponible: true,

      },
      {
        hora: '08:30',
        disponible: true,

      },
      {
        hora: '09:00',
        disponible: true,

      },
      {
        hora: '09:30',
        disponible: true,

      },
      {
        hora: '10:00',
        disponible: true,

      },
      {
        hora: '10:30',
        disponible: true,

      },
      {
        hora: '11:00',
        disponible: true,

      },
      {
        hora: '11:30',
        disponible: true,

      },
      {
        hora: '12:00',
        disponible: true,

      },
      {
        hora: '12:30',
        disponible: true,

      },
      {
        hora: '13:00',
        disponible: true,

      },
      {
        hora: '13:30',
        disponible: true,

      },
      {
        hora: '14:00',
        disponible: true,

      },
      {
        hora: '14:30',
        disponible: true,

      },
      {
        hora: '15:00',
        disponible: true,

      },
      {
        hora: '15:30',
        disponible: true,

      },
      {
        hora: '16:00',
        disponible: true,

      },
      {
        hora: '16:30',
        disponible: true,

      },
      {
        hora: '17:00',
        disponible: true,

      },
      {
        hora: '17:30',
        disponible: true,

      },
      {
        hora: '18:00',
        disponible: true,

      },
      {
        hora: '18:30',
        disponible: true,

      },

    ];

    const horariosSabado = [
      {
        hora: '08:00',
        disponible: true,

      },
      {
        hora: '08:30',
        disponible: true,

      },
      {
        hora: '09:00',
        disponible: true,

      },
      {
        hora: '09:30',
        disponible: true,

      },
      {
        hora: '10:00',
        disponible: true,

      },
      {
        hora: '10:30',
        disponible: true,

      },
      {
        hora: '11:00',
        disponible: true,

      },
      {
        hora: '11:30',
        disponible: true,

      },
      {
        hora: '12:00',
        disponible: true,

      },
      {
        hora: '12:30',
        disponible: true,

      },
      {
        hora: '13:00',
        disponible: true,

      },
      {
        hora: '13:30',
        disponible: true,

      },

    ];

    const dias = {
      lunes: horarios,
      martes: horarios,
      miercoles: horarios,
      jueves: horarios,
      viernes: horarios,
      sabado: horariosSabado,
    }


    const cronograma = {
      consultorio1: dias,
      consultorio2: dias,
      consultorio3: dias,
      consultorio4: dias,
      consultorio5: dias,
      consultorio6: dias,
    }



    addDoc(this.cronoRef, cronograma);
  }


  traerCronograma(): Observable<Cronograma> {
    return new Observable<Cronograma>((observer) => {
      onSnapshot(this.cronoRef, (snap) => {
        snap.docChanges().forEach(x => {
          const crono = x.doc.data();
          observer.next(crono);
        });
      });
    });
  }

  getHorario(crono: Cronograma, dia: string) {
    const horarios = {} as JornadaDiaView;
    for (const consultorio in crono) {
      horarios[consultorio] = crono[consultorio][dia]
    }
    return horarios;
  }

  updateCronograma(cronograma: Cronograma): void {
    if (!cronograma || typeof cronograma !== 'object') {
      console.error("Invalid cronograma object:", cronograma);
      return;
  }

  // Asegúrate de que cronograma esté bien definido y estructurado aquí
  // Luego, llama a Firebase updateDoc
  const cronogramaRef = doc(this.firestore, 'cronograma/nOi8wN4JbG95wF5ivTqv');
  updateDoc(cronogramaRef, cronograma)
      .then(() => {
          console.log("Cronograma updated successfully");
      })
      .catch((error) => {
          console.error("Error updating cronograma:", error);
      });
  }

  actualizarCronograma(cronograma: Cronograma, nuevosDatos: Cronograma): Cronograma {
    const cronogramaNuevo: Cronograma = { ...cronograma };

    for (const consultorio in nuevosDatos) {
      if (nuevosDatos.hasOwnProperty(consultorio)) {
        if (!cronogramaNuevo[consultorio]) {
          cronogramaNuevo[consultorio] = {};
        }

        const diasCronograma = nuevosDatos[consultorio];
        for (const dia in diasCronograma) {
          if (diasCronograma.hasOwnProperty(dia)) {
            const horariosCronograma = diasCronograma[dia];
            if (!cronogramaNuevo[consultorio][dia]) {
              cronogramaNuevo[consultorio][dia] = [];
            }

            for (const horarioNuevo of horariosCronograma) {
              const indice = cronogramaNuevo[consultorio][dia].findIndex((horarioExistente) => horarioExistente.hora === horarioNuevo.hora);

              if (indice !== -1) {
                cronogramaNuevo[consultorio][dia][indice].disponible = horarioNuevo.disponible;
              } else {
                cronogramaNuevo[consultorio][dia].push({ hora: horarioNuevo.hora, disponible: horarioNuevo.disponible });
              }
            }
          }
        }
      }
    }

    return cronogramaNuevo;
  }

}